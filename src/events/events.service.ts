import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { CreateEventDto } from '@/events/dto/create-event.dto'
import { ReserveSpotDto } from '@/events/dto/reserve-spot.dto'
import { UpdateEventDto } from '@/events/dto/update-event.dto'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: createEventDto,
    })
  }

  findAll() {
    return this.prismaService.event.findMany()
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: { id },
    })
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      where: { id },
      data: updateEventDto,
    })
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    })
  }

  async reserveSpot({
    email,
    eventId,
    spots: spotNames,
    ticketKind,
  }: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId,
        name: {
          in: spotNames,
        },
      },
    })

    if (spots.length !== spotNames.length) {
      const foundSpots = spots.map((spot) => spot.name)
      const missingSpots = spotNames.filter(
        (spot) => !foundSpots.includes(spot),
      )
      throw new BadRequestException(
        `Spots not found: ${missingSpots.join(', ')}`,
      )
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind,
              email,
              status: TicketStatus.RESERVED,
            })),
          })

          await prisma.spot.updateMany({
            where: {
              id: { in: spots.map((spot) => spot.id) },
            },
            data: { status: SpotStatus.RESERVED },
          })

          const tickets = await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind,
                  email,
                },
              }),
            ),
          )

          return tickets
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      )
      return tickets
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002': // Unique constraint violation
          case 'P2034': // Foreign key constraint violation (transaction conflict)
            throw new BadRequestException('Some spots are already reserved')
        }
      }
      throw err
    }
  }
}

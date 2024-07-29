import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'
import { CreateSpotDto } from '@/spots/dto/create-spot.dto'
import { UpdateSpotDto } from '@/spots/dto/update-spot.dto'
import { SpotStatus } from '@prisma/client'

@Injectable()
export class SpotsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: createSpotDto.eventId,
      },
    })

    if (!event) {
      throw new NotFoundException('Event not found')
    }

    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.AVAILABLE,
      },
    })
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: {
        eventId,
      },
    })
  }

  findOne(eventId: string, spotId: string) {
    return this.prismaService.spot.findUnique({
      where: {
        id: spotId,
        eventId,
      },
    })
  }

  update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    return this.prismaService.spot.update({
      where: {
        id: spotId,
        eventId,
      },
      data: updateSpotDto,
    })
  }

  remove(eventId: string, spotId: string) {
    return this.prismaService.spot.delete({
      where: {
        id: spotId,
        eventId,
      },
    })
  }
}

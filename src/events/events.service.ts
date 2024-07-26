import { Injectable } from '@nestjs/common'

import { CreateEventDto } from '@/events/dto/create-event.dto'
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
}

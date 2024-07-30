import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common'

import { CreateEventDto } from '@/events/dto/create-event.dto'
import { ReserveSpotDto } from '@/events/dto/reserve-spot.dto'
import { UpdateEventDto } from '@/events/dto/update-event.dto'
import { EventsService } from '@/events/events.service'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto)
  }

  @Post(':id/reserve')
  reserveSpot(
    @Param('id') eventId: string,
    @Body() reserveSpotDto: ReserveSpotDto,
  ) {
    return this.eventsService.reserveSpot({
      ...reserveSpotDto,
      eventId,
    })
  }

  @Get()
  findAll() {
    return this.eventsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto)
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id)
  }
}

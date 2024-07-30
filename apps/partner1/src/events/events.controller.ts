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

import { EventsService } from '@app/core'
import { CreateEventRequest } from '@partner1/events/request/create-event.request'
import { ReserveSpotRequest } from '@partner1/events/request/reserve-spot.request'
import { UpdateEventRequest } from '@partner1/events/request/update-event.request'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventRequest: CreateEventRequest) {
    return this.eventsService.create(createEventRequest)
  }

  @Post(':id/reserve')
  reserveSpot(
    @Param('id') eventId: string,
    @Body() reserveSpotRequest: ReserveSpotRequest,
  ) {
    return this.eventsService.reserveSpot({
      ...reserveSpotRequest,
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
  update(
    @Param('id') id: string,
    @Body() updateEventRequest: UpdateEventRequest,
  ) {
    return this.eventsService.update(id, updateEventRequest)
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id)
  }
}

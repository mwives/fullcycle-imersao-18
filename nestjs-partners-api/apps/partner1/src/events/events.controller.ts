import { EventsService } from '@app/core'
import { AuthGuard } from '@app/core/auth/auth.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreateEventRequest } from '@partner1/events/request/create-event.request'
import { ReserveSpotRequest } from '@partner1/events/request/reserve-spot.request'
import { UpdateEventRequest } from '@partner1/events/request/update-event.request'
import { ReserveSpotResponse } from './response/reserve-spot.response'

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventRequest: CreateEventRequest) {
    return this.eventsService.create(createEventRequest)
  }

  @UseGuards(AuthGuard)
  @Post(':id/reserve')
  async reserveSpot(
    @Param('id') eventId: string,
    @Body() reserveSpotRequest: ReserveSpotRequest,
  ) {
    const tickets = await this.eventsService.reserveSpot({
      ...reserveSpotRequest,
      eventId,
    })
    return new ReserveSpotResponse(tickets)
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

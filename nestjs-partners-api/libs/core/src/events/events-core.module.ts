import { Module } from '@nestjs/common'
import { EventsService } from '@app/core/events/events.service'

@Module({
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsCoreModule {}

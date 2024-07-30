import { EventsCoreModule } from '@app/core'
import { Module } from '@nestjs/common'
import { EventosController } from './eventos.controller'

@Module({
  imports: [EventsCoreModule],
  controllers: [EventosController],
})
export class EventosModule {}

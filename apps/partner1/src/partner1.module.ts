import { PrismaModule } from '@app/core/prisma/prisma.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventsModule } from './events/events.module'
import { SpotsModule } from './spots/spots.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.partner1',
    }),
    PrismaModule,
    EventsModule,
    SpotsModule,
  ],
})
export class Partner1Module {}

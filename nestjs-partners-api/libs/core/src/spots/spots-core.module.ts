import { Module } from '@nestjs/common'
import { SpotsService } from '@app/core/spots/spots.service'

@Module({
  providers: [SpotsService],
  exports: [SpotsService],
})
export class SpotsCoreModule {}

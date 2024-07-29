import { PartialType } from '@nestjs/mapped-types'

import { CreateSpotDto } from '@/spots/dto/create-spot.dto'

export class UpdateSpotDto extends PartialType(CreateSpotDto) {}

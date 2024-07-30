import { PartialType } from '@nestjs/mapped-types'
import { CreateEventRequest } from '@partner1/events/request/create-event.request'

export class UpdateEventRequest extends PartialType(CreateEventRequest) {}

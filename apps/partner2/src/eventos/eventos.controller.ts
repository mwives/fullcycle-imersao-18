import { EventsService } from '@app/core'
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
import { AtualizarEventoRequest } from './request/atualizar-evento.request'
import { CriarEventoRequest } from './request/criar-evento.request'
import { ReservarLugarRequest } from './request/reservar-lugar.request'
import { TipoIngresso } from './enum/tipo-ingresso.enum'
import { TicketKind } from '@prisma/client'

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() { data, descricao, nome, preco }: CriarEventoRequest) {
    return this.eventsService.create({
      name: nome,
      description: descricao,
      date: data,
      price: preco,
    })
  }

  @Post(':id/reservar')
  reserveSpot(
    @Param('id') eventoId: string,
    @Body() reservarLugarRequest: ReservarLugarRequest,
  ) {
    const tipoIngresso =
      reservarLugarRequest.tipoIngresso === TipoIngresso.INTEIRA
        ? TicketKind.FULL
        : TicketKind.HALF

    return this.eventsService.reserveSpot({
      eventId: eventoId,
      spots: reservarLugarRequest.lugares,
      ticketKind: tipoIngresso,
      email: reservarLugarRequest.email,
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
    @Body() atualizarEventoRequest: AtualizarEventoRequest,
  ) {
    return this.eventsService.update(id, {
      name: atualizarEventoRequest.nome,
      description: atualizarEventoRequest.descricao,
      date: atualizarEventoRequest.data,
      price: atualizarEventoRequest.preco,
    })
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id)
  }
}

import { TipoIngresso } from '../enum/tipo-ingresso.enum'

export class ReservarLugarRequest {
  lugares: string[]
  tipoIngresso: TipoIngresso
  email: string
}

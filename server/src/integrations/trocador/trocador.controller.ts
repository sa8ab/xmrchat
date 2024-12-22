import { Controller, Get } from '@nestjs/common';
import { TrocadorService } from './trocador.service';

@Controller('trocador')
export class TrocadorController {
  constructor(private trocadorService: TrocadorService) {}

  @Get('/get-coins')
  getCoins() {
    return this.trocadorService.getCoins();
  }
}

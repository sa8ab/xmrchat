import { Controller, Get } from '@nestjs/common';
import { TrocadorService } from './trocador.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller('trocador')
export class TrocadorController {
  constructor(private trocadorService: TrocadorService) {}

  @IsPublic()
  @Get('/get-coins')
  getCoins() {
    return this.trocadorService.getAndSaveCoins();
  }
}

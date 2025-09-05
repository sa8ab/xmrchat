import { Controller, Get, Res } from '@nestjs/common';
import { SignalService } from './signal.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { Response } from 'express';

@Controller('signal')
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @Get('qrcode')
  @IsPublic()
  async getQrCode(@Res() res: Response) {
    const pngBuf = await this.signalService.generateQrCode();
    res.setHeader('Content-Type', 'image/png');
    return res.send(pngBuf);
  }
}

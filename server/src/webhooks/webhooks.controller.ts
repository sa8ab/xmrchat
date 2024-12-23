import {
  Controller,
  Post,
  Param,
  Body,
  UnauthorizedException,
  Logger,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { PagesService } from 'src/pages/pages.service';
import { PaymentsService } from 'src/payments/payments.service';
import { TipsGateway } from 'src/tips/tips.gateway';
import { TipsService } from 'src/tips/tips.service';
import { LwsWebhookEvent } from 'src/shared/types';
import { SwapsService } from 'src/swaps/swaps.service';

@Controller('webhooks')
export class WebhooksController {
  private logger = new Logger(WebhooksController.name);

  constructor(
    private configService: ConfigService,
    private paymentsService: PaymentsService,
    private tipsService: TipsService,
    private pagesService: PagesService,
    private tipsGateway: TipsGateway,
    private swapsService: SwapsService,
  ) {}

  @Post('/:token')
  @IsPublic()
  async handleWebhook(
    @Param('token') token: string,
    @Body() body: LwsWebhookEvent,
  ) {
    if (token !== this.configService.get('LWS_WEBHOOK_TOKEN'))
      throw new UnauthorizedException();

    const eventType = body.event;
    const amount = body.tx_info.amount;

    this.logger.log(
      `Webhook call - Confirmations: ${body.confirmations} - Event Id: ${body.event_id} - TX Hash: ${body.tx_info.tx_hash}`,
    );

    // ? lws sends webhook twice, on 0 and 1 confirmations. ignore others.
    if (body.confirmations !== 0) return;

    if (eventType !== 'tx-confirmation') {
      this.logger.warn('Event different from tx-confirmation');
      return;
    }

    const payment = await this.paymentsService.findOneByEventId(body.event_id);

    if (!payment) {
      this.logger.warn(`Payment not found with event id: ${body.event_id}`);
      return;
    }

    if (payment.pageSlug)
      return this.pagesService.handlePagePayment(payment, amount);

    return this.tipsService.handleTipPayment(payment, amount);
  }

  @IsPublic()
  @Post(`/trocator/:token/:tipId`)
  async trocadorTransaction(
    @Body() body,
    @Param('token') token: string,
    @Param('tipId') tipId: string,
  ) {
    if (token !== this.configService.get('TROCADOR_WEBHOOK_TOKEN'))
      throw new UnauthorizedException();

    const tip = await this.tipsService.findOneById(parseInt(tipId));

    if (!tip) throw new NotFoundException('Tip is not found.');

    console.log(body, tipId);

    return this.swapsService.handleTrocadorStatusChange(body);
  }

  @Get('/test')
  @IsPublic()
  test() {
    return this.tipsGateway.notifyTipPayment(1234, 'some value' as any);
  }
}

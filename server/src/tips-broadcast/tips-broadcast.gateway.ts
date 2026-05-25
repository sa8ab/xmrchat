import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { PageTipTier } from 'src/page-tip-tiers/page-tip-tier.entity';
import { PageDto } from 'src/pages/dtos/page.dto';
import { serializer } from 'src/shared/interceptors/serialize.interceptor';
import { getTipTier } from 'src/shared/utils';
import { TipMessageService } from 'src/tip-message/tip-message.service';
import { TipDto } from 'src/tips/dtos/tip.dto';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  namespace: '/tips-broadcast',
})
export class TipsBroadcastGateway implements OnGatewayConnection {
  private logger = new Logger(TipsBroadcastGateway.name);

  constructor(
    private tipMessageService: TipMessageService,
    @InjectRepository(Tip) private tipsRepo: Repository<Tip>,
  ) {}

  @WebSocketServer()
  server: Namespace;

  async handleConnection(client: Socket) {
    // This is used to trigger the connection recovery
    client.emit('dummyEvent');

    this.logger.log(
      `Client ${client.id.slice(0, 8)}... connected to tips-broadcast`,
    );
  }

  async notifyNewTip(tipId: number) {
    const tip = await this.tipsRepo.findOne({
      where: { id: tipId },
      relations: { page: { pageTipTiers: { sound: true } }, payment: true },
    });

    if (!tip) return;

    const eventPayload = await this.generateEventPayload({
      tip,
      pageTipTiers: tip.page.pageTipTiers,
    });

    this.server.emit('tip', eventPayload);
  }

  async generateEventPayload({
    tip,
    pageTipTiers,
  }: {
    tip: Tip;
    pageTipTiers?: PageTipTier[];
  }) {
    const tier = getTipTier(tip.payment.amount, pageTipTiers);

    const message = await this.tipMessageService.generateMessage(
      tip.id,
      tip.page.id,
    );

    tip = Object.assign({}, tip, { pageTipTier: tier });
    const page = serializer(PageDto, tip.page);

    const t = serializer(TipDto, tip);

    return { tip: t, message, page };
  }
}

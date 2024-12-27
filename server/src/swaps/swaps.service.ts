import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/integrations/trocador/coin.entity';
import { TrocadorService } from 'src/integrations/trocador/trocador.service';
import { Tip } from 'src/tips/tip.entity';
import { Repository } from 'typeorm';
import { Swap } from './swap.entity';
import { TrocadorTrade } from 'src/shared/types';
import { getSwapStatusFromTrocador } from 'src/shared/utils';
import { SwapStatusEnum } from 'src/shared/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from 'src/notifications/notifications.service';

interface InitSwapData {
  coinId: number;
  amountTo: number;
  address: string;
  tip: Tip;
}

@Injectable()
export class SwapsService {
  private logger = new Logger(SwapsService.name);
  constructor(
    private trocadorService: TrocadorService,
    private notificationsService: NotificationsService,
    @InjectRepository(Coin) private coinRepo: Repository<Coin>,
    @InjectRepository(Swap) private repo: Repository<Swap>,
    @Inject(CACHE_MANAGER) private cahceManager: Cache,
  ) {}

  async findOneById(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }
  async findOneByTipId(tipId: number) {
    if (!tipId) return null;
    return this.repo.findOneBy({ tip: { id: tipId } });
  }

  async findAllCoins() {
    return this.coinRepo.find();
  }

  async initSwap(data: InitSwapData, platform = 'trocador') {
    const coin = await this.coinRepo.findOneBy({ id: data.coinId });

    if (platform === 'trocador')
      return this.initTrocadorSwap({ ...data, coin });

    throw new BadRequestException('Swap platform is not valid');
  }

  async initTrocadorSwap(data: InitSwapData & { coin: Coin }) {
    let trade: TrocadorTrade;
    try {
      trade = await this.trocadorService.initSwap(data);
    } catch (error) {
      throw new BadRequestException('Could not create new trade on Trocador.');
    }

    const created = this.repo.create({
      context: trade,
      coin: { id: data.coin.id },
      inputAmount: trade.amount_from,
      swapAddress: trade.address_provider,
      swapId: trade.trade_id,
      tip: { id: data.tip.id },
      status: SwapStatusEnum.WAITING,
    });

    const swap = await this.repo.save(created);
    swap.coin = data.coin;

    console.log(trade);

    return swap;
  }

  async handleTrocadorStatusChange(body: TrocadorTrade, tip: Tip) {
    const swapStatus = getSwapStatusFromTrocador(body.status);
    console.log(swapStatus);

    const swap = await this.findOneByTipId(tip.id);

    if (!swap) throw new NotFoundException('Swap is not found.');

    // Update swap status and message
    swap.status = swapStatus.status;
    swap.statusMessage = swapStatus.message;

    const saved = await this.repo.save(swap);

    // TODO: Call gateway for swap status change

    return saved;
  }

  async validateXmrAmount(amount: number) {
    const coin = await this.coinRepo.findOneBy({ ticker: 'xmr' });

    return {
      coin,
      valid: coin.minimum <= amount && amount <= coin.maximum,
    };
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async isSwapActive() {
    const savedActive = await this.cahceManager.get('swap-active');
    const isActive = await this.trocadorService.isActive();

    await this.cahceManager.set('swap-active', isActive);

    if (savedActive && !isActive) {
      // Send trocador down email
      this.notificationsService.sendSwapStatusEmail(false);
      this.logger.log('Trocador is down');
    }

    if (isActive && !savedActive) {
      // send trocador up email
      this.notificationsService.sendSwapStatusEmail(true);
      this.logger.log('Trocador is up');
    }

    return isActive;
  }
}

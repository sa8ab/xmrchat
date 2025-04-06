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
import { InitSwapData, TrocadorTrade } from 'src/shared/types';
import { getSwapStatusFromTrocador } from 'src/shared/utils';
import { SwapStatusEnum } from 'src/shared/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from 'src/notifications/notifications.service';

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

  async findOneBySwapId(swapId: string) {
    if (!swapId) return null;
    return this.repo.findOne({ where: { swapId }, relations: ['tip'] });
  }

  async findAllCoins() {
    return this.coinRepo.find();
  }

  // Creates a swap on exchange
  async initSwap(data: InitSwapData, platform = 'trocador') {
    const coin = await this.coinRepo.findOneBy({ id: data.coinId });

    if (platform === 'trocador') {
      const swap = await this.initTrocadorSwap({ ...data, coin });
      return { baseSwap: swap, coin };
    }

    throw new BadRequestException('Swap platform is not valid');
  }

  // Saves a swap on database
  async saveSwap({
    baseSwap,
    coin,
    tip,
  }: {
    baseSwap: TrocadorTrade; // TODO: Abstract trade type
    coin: Coin;
    tip: Tip;
  }) {
    const created = this.repo.create({
      context: baseSwap,
      coin: { id: coin.id },
      inputAmount: baseSwap.amount_from,
      swapAddress: baseSwap.address_provider,
      swapId: baseSwap.trade_id,
      eta: baseSwap.details.original_eta,
      tip: { id: tip.id },
      status: SwapStatusEnum.WAITING,
    });

    const swap = await this.repo.save(created);
    swap.coin = coin;

    return swap;
  }

  async initTrocadorSwap(data: InitSwapData & { coin: Coin }) {
    let trade: TrocadorTrade;
    try {
      trade = await this.trocadorService.initSwap(data);
    } catch (error) {
      throw new BadRequestException('Could not create new trade on Trocador.');
    }

    return trade;
  }

  async handleTrocadorStatusChange(body: TrocadorTrade, id: number) {
    const swapStatus = getSwapStatusFromTrocador(body.status);
    console.log(swapStatus);

    const swap = await this.findOneById(id);

    if (!swap) throw new NotFoundException('Swap is not found.');

    // Update swap status and message
    swap.status = swapStatus.status;
    swap.statusMessage = swapStatus.message;

    const saved = await this.repo.save(swap);

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
    const status = await this.trocadorService.getStatus();

    await this.cahceManager.set('swap-active', status.active);

    if (savedActive && !status.active) {
      // Send trocador down email
      this.notificationsService.sendSwapStatusEmail(false, status.reason);
      this.logger.log('Trocador is down');
    }

    if (status.active && !savedActive) {
      // send trocador up email
      this.notificationsService.sendSwapStatusEmail(true);
      this.logger.log('Trocador is up');
    }

    return status.active;
  }

  async getIsSwapActive() {
    return this.cahceManager.get('swap-active');
  }
}

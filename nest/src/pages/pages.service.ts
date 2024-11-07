import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ReserveSlugDto } from './dtos/reserve-slug.dto';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './page.entity';
import { Repository } from 'typeorm';
import { makeIntegratedAddress } from 'src/shared/utils/monero';
import { LwsService } from 'src/lws/lws.service';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from 'src/payments/payments.service';
import { MoneroUtils } from 'monero-ts';
import { Payment } from 'src/payments/payment.entity';
import { PagesGateway } from './pages.gateway';
import { Tip } from 'src/tips/tip.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UpdatePageDto } from './dtos/update-page.dto';

@Injectable()
export class PagesService {
  private logger = new Logger(PagesService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Page) private repo: Repository<Page>,
    private lwsService: LwsService,
    private configService: ConfigService,
    private paymentsService: PaymentsService,
    private pagesGateway: PagesGateway,
    private notificationsService: NotificationsService,
  ) {}

  async searchPages(slug: string = '', offset: number = 0, limit: number = 8) {
    let query = this.repo
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.logo', 'logo')
      .leftJoinAndSelect('page.coverImage', 'cover_image')
      .leftJoin(
        (qb) => {
          return qb
            .select(['tip.id', 'tip.page_id', 'payment.paid_amount'])
            .from(Tip, 'tip')
            .innerJoin('tip.payment', 'payment')
            .where('payment.paid_at IS NOT NULL');
        },
        'paid_tip',
        'paid_tip.page_id = page.id',
      )
      .where('page.isPublic = true')
      .addSelect('SUM(paid_tip.paid_amount::NUMERIC) AS total_paid')
      .groupBy('page.id, logo.id, cover_image.id')
      .orderBy('total_paid', 'DESC', 'NULLS LAST');

    if (slug) {
      query = query.where('page.path LIKE :path', { path: `%${slug}%` });
    }

    query = query.offset(offset).limit(limit);

    const pages = await query.getMany();
    const total = await query.getCount();
    return {
      pages,
      total,
    };
  }

  async checkSlug(slug: string) {
    const onRedis = await this.cacheManager.get(`slug:${slug}`);

    const onPages = await this.findByPath(slug);

    return {
      available: !onRedis && !onPages,
    };
  }

  async reserveSlug(payload: ReserveSlugDto, user: User) {
    const { available } = await this.checkSlug(payload.path);

    if (!available)
      throw new BadRequestException('Slug/Path is unavailable/owned.');

    const reservedUntil = Date.now() + 60 * 15 * 1000;

    const cache = { ...payload, userId: user.id };

    await this.cacheManager.set(`slug:${payload.path}`, JSON.stringify(cache), {
      ttl: 60 * 15,
    } as any);

    const adminAddress = this.configService.get('ADMIN_MONERO_PRIMARY_ADDRESS');
    const paymentAmount = this.configService.get('PAGE_CREATION_FEE');

    const { integratedAddress, paymentId } =
      makeIntegratedAddress(adminAddress);

    // try creating an lws account on admin primary address, catch if already exists
    try {
      const res = await this.lwsService.addAccount({
        address: adminAddress,
        key: this.configService.get('ADMIN_MONERO_PRIVATE_VIEW_KEY'),
      });
    } catch (error) {
      this.logger.warn('Adding admin account failed, probably already added.');
    }

    // create an lws event for payment on admin
    const webhook = await this.lwsService.addWebhook({
      address: adminAddress,
      paymentId,
      token: `streamer-${payload.path}`,
      type: 'tx-confirmation',
    });

    // create a record on payments table
    await this.paymentsService.createPayment({
      amount: paymentAmount,
      pageSlug: payload.path,
      eventId: webhook.event_id,
    });

    return {
      paymentAddress: integratedAddress,
      amount: MoneroUtils.atomicUnitsToXmr(paymentAmount),
      reservedUntil,
    };
  }

  async findByPath(path: string) {
    if (!path) return null;
    return this.repo.findOne({
      where: { path },
      relations: { tiers: true },
    });
  }

  async findById(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  async findMyPage(user: User) {
    if (!user) return null;

    return this.repo.findOne({
      where: { user: { id: user.id } },
      relations: { tiers: true },
    });
  }

  async create(
    payload: ReserveSlugDto & { paymentId: number; userId: number },
  ) {
    const created = this.repo.create({
      description: '',
      isPublic: payload.isPublic,
      name: payload.path,
      path: payload.path,
      primaryAddress: payload.primaryAddress,
      secretViewKey: payload.secretViewKey,
      twitchChannel: payload.twitchChannel,

      coverImage: { id: payload.coverImage },
      logo: { id: payload.logo },
      payment: { id: payload.paymentId },
      user: { id: payload.userId },
    });

    return this.repo.save(created);
  }

  async handlePagePayment(payment: Payment, amount: number | string) {
    const pageSlug = payment.pageSlug as string;

    const reservedPageJson = await this.cacheManager.get<string>(
      `slug:${pageSlug}`,
    );

    if (!reservedPageJson) {
      this.logger.warn(`Page reservation is expired`);
      return;
    }

    const reserevdPage = JSON.parse(reservedPageJson);

    const savedPayment = await this.paymentsService.updatePaidAmount(
      payment.id,
      amount,
    );

    if (!savedPayment.isPaid()) {
      this.logger.log(
        `Transaction received but is lower than expected amount ${savedPayment.amount} - Current paid amount: ${savedPayment.paidAmount} - isPaid: ${savedPayment.isPaid()}`,
      );
      return;
    }

    // create page
    const page = await this.create({
      path: reserevdPage.path,
      isPublic: reserevdPage.isPublic,
      logo: reserevdPage.logo,
      coverImage: reserevdPage.coverImage,
      primaryAddress: reserevdPage.primaryAddress,
      secretViewKey: reserevdPage.secretViewKey,
      userId: reserevdPage.userId,
      paymentId: payment.id,
      twitchChannel: reserevdPage.twitchChannel,
    });

    this.logger.log(`Sending page event. Page Slug: ${page.path}`);
    this.pagesGateway.notifyPagePayment(page.path, savedPayment);

    this.notificationsService.sendNewPageReportEmail({
      pageId: page.id,
      price: payment.amount,
      slug: page.path,
      userId: reserevdPage.userId,
      // TODO: get full user
      userName: '',
    });

    // remove reserved from cache
    await this.cacheManager.del(`slug:${pageSlug}`);

    // clear webhook
    try {
      await this.lwsService.deleteWebhook(payment.eventId);
    } catch (error) {}
  }

  async update(slug: string, attrs: UpdatePageDto, user: User) {
    this.logger.log(attrs);
    const page = await this.findByPath(slug);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.userId !== user.id) {
      throw new UnauthorizedException();
    }

    // TODO: Adding the account to lws for validation?

    attrs.tiers = attrs.tiers || [];

    const savedPage = Object.assign(page, attrs);

    const result = await this.repo.save(savedPage);
    console.log(result);

    return result;
  }
}
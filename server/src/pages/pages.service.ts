import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  forwardRef,
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
import { TwitchService } from 'src/integrations/twitch/twitch.service';
import { AuditsService } from 'src/audits/audits.service';
import { AuditTypeEnum, PageStatusEnum } from 'src/shared/constants';
import { File as FileEntity } from 'src/files/file.entity';

@Injectable()
export class PagesService {
  private logger = new Logger(PagesService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Page) private repo: Repository<Page>,
    @InjectRepository(FileEntity) private filesRepo: Repository<FileEntity>,
    private lwsService: LwsService,
    private configService: ConfigService,
    private paymentsService: PaymentsService,
    @Inject(forwardRef(() => PagesGateway))
    private pagesGateway: PagesGateway,
    private notificationsService: NotificationsService,
    private twitchService: TwitchService,
    private auditsService: AuditsService,
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
      .andWhere('page.status != :status', { status: PageStatusEnum.DEACTIVE })
      .addSelect('SUM(paid_tip.paid_amount::NUMERIC) AS total_paid')
      .groupBy('page.id, logo.id, cover_image.id')
      .orderBy('total_paid', 'DESC', 'NULLS LAST');

    if (slug) {
      query = query.andWhere(
        '(LOWER(page.path) LIKE :path OR LOWER(page.name) LIKE :name OR LOWER(page.searchTerms) LIKE :searchTerms)',
        {
          path: `%${slug.toLowerCase()}%`,
          name: `%${slug.toLowerCase()}%`,
          searchTerms: `%${slug.toLowerCase()}%`,
        },
      );
    }

    query = query.offset(offset).limit(limit);

    const pages = await query.getMany();
    const total = await query.getCount();

    return {
      pages,
      total,
    };
  }

  async sitemapPages() {
    const pages = await this.repo.find({
      where: { isPublic: true, status: PageStatusEnum.ACTIVE },
    });

    return { pages };
  }

  async adminSearchPages(
    slug: string = '',
    offset: number = 0,
    limit: number = 20,
  ) {
    let query = this.repo
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.logo', 'logo')
      .leftJoinAndSelect('page.user', 'user')
      .leftJoin('page.tips', 'tip')
      .leftJoin('tip.payment', 'payment', 'payment.paid_at IS NOT NULL')
      .addSelect('SUM(payment.paid_amount::NUMERIC)', 'total_tips')
      .addSelect(
        (qb) =>
          qb
            .select('COUNT(*)')
            .from(Tip, 'tip')
            .leftJoin('tip.payment', 'payment')
            .where('payment.paid_at IS NOT NULL')
            .andWhere('tip.page_id = page.id'),
        'tips_count',
      )

      // This is a different way of loading count of tips.
      // .loadRelationCountAndMap('page.tipsCount', 'page.tips', 'tip', (qb) =>
      //   qb
      //     .leftJoin('tip.payment', 'payment')
      //     .where('payment.paid_at IS NOT NULL'),
      // )
      .groupBy('page.id, logo.id, user.id')
      .orderBy('tips_count', 'DESC', 'NULLS LAST');

    if (slug) {
      query = query.andWhere(
        '(LOWER(page.path) LIKE :path OR LOWER(page.name) LIKE :name OR LOWER(page.searchTerms) LIKE :searchTerms)',
        {
          path: `%${slug.toLowerCase()}%`,
          name: `%${slug.toLowerCase()}%`,
          searchTerms: `%${slug.toLowerCase()}%`,
        },
      );
    }

    query = query.offset(offset).limit(limit);

    const { entities, raw } = await query.getRawAndEntities();

    const result = entities.map((entity, index) => {
      const totalTips = MoneroUtils.atomicUnitsToXmr(
        raw[index].total_tips || '',
      );
      entity.totalTips = totalTips;
      entity.tipsCount = raw[index].tips_count;
      return entity;
    });

    const total = await query.getCount();

    return {
      pages: result,
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

    if (payload.twitchChannel) {
      const twitchExists = await this.twitchService.channelExists(
        payload.twitchChannel,
      );
      if (!twitchExists)
        throw new BadRequestException(
          'Twtich channel does not exist. Only provide the name of the channel.',
        );
    }

    const reservedUntil = Date.now() + 60 * 30 * 1000;

    const cache = { ...payload, userId: user.id };

    await this.cacheManager.set(`slug:${payload.path}`, JSON.stringify(cache), {
      ttl: 60 * 30,
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
    path = path.toLowerCase();
    return this.repo.findOne({
      where: { path },
      relations: { tiers: true, links: true },
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

    this.logger.log(`Sending page created event. Page Slug: ${page.path}`);
    this.pagesGateway.notifyPagePayment(page.path, savedPayment);

    this.notificationsService.sendNewPageReportEmail({
      pageId: page.id,
      price: MoneroUtils.atomicUnitsToXmr(payment.amount).toString(),
      slug: page.path,
      userId: reserevdPage.userId,
      // TODO: get full user
      userName: '',
      time: page.createdAt.toLocaleDateString(),
    });

    // remove reserved from cache
    await this.cacheManager.del(`slug:${pageSlug}`);

    await this.addLwsAccount({
      address: page.primaryAddress,
      key: page.secretViewKey,
    });

    // clear webhook
    try {
      await this.lwsService.deleteWebhook(payment.eventId);
    } catch (error) {}
  }

  async update(slug: string, attrs: UpdatePageDto, user: User) {
    const page = await this.findByPath(slug);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const configMinAmount = this.configService.get('MIN_TIP_AMOUNT');

    const globalMinTipAmount = BigInt(configMinAmount);

    const minTipAmount = MoneroUtils.xmrToAtomicUnits(
      attrs.minTipAmount || configMinAmount,
    );

    if (minTipAmount < globalMinTipAmount) {
      throw new BadRequestException(
        `Minimum tip amount must be more than global minimum of ${MoneroUtils.atomicUnitsToXmr(configMinAmount)} XMR.`,
      );
    }

    if (page.userId !== user.id) {
      throw new UnauthorizedException();
    }

    if (attrs.twitchChannel) {
      const twitchExists = await this.twitchService.channelExists(
        attrs.twitchChannel,
      );
      if (!twitchExists)
        throw new BadRequestException(
          'Twtich channel does not exist. Only provide the name of the channel.',
        );
    }

    attrs.tiers = attrs.tiers || [];
    attrs.minTipAmount = attrs.minTipAmount
      ? MoneroUtils.xmrToAtomicUnits(attrs.minTipAmount).toString()
      : null;

    if (
      page.primaryAddress != attrs.primaryAddress ||
      page.secretViewKey != attrs.secretViewKey
    ) {
      await this.addLwsAccount({
        address: attrs.primaryAddress,
        key: attrs.secretViewKey,
      });
    }

    const { coverImage, logo, ...attrsRest } = attrs;

    if (attrs.coverImage) {
      const coverImageEntity = await this.filesRepo.findOneBy({
        id: attrs.coverImage,
      });
      coverImageEntity.thumbnail = coverImageEntity.thumbnail + '?v=2';
      page.coverImage = coverImageEntity;
    }

    if (attrs.logo) {
      const logoEntity = await this.filesRepo.findOneBy({ id: attrs.logo });
      page.logo = logoEntity;
    }

    const savedPage = Object.assign(page, attrsRest);

    const result = await this.repo.save(savedPage);

    return result;
  }

  async updateNameAndSearchTerms(
    id: number,
    attrs: { name: string; searchTerms: string },
  ) {
    const page = await this.findById(id);
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const savedPage = Object.assign(page, attrs);

    return this.repo.save(savedPage);
  }

  async addLwsAccount(data: { address: string; key: string }) {
    try {
      this.logger.log(`Adding lws account: ${data.address} - ${data.key}`);
      await this.lwsService.addAccount(data);
    } catch (error) {
      this.logger.warn('Adding Lws account after create or update failed.');
    }
  }

  async findAdminPageByPath(path: string) {
    if (!path) return null;

    let query = this.repo
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.user', 'user')
      .where('page.path = :path', { path })
      .leftJoin('Tip', 'tip', 'tip.page_id = page.id')
      .leftJoin('tip.payment', 'payment', 'payment.paid_at IS NOT NULL')
      .addSelect('SUM(COALESCE(payment.paid_amount::NUMERIC, 0))', 'total_tips')
      .addSelect('COUNT(payment.id)', 'tips_count')
      .groupBy('page.id, user.id');

    const raw = await query.getRawOne();
    const entity = await query.getOne();
    entity.totalTips = MoneroUtils.atomicUnitsToXmr(raw.total_tips || '');
    entity.tipsCount = parseInt(raw.tips_count);

    return entity;
  }

  async changeStatus(path: string, status: PageStatusEnum) {
    const page = await this.findByPath(path);

    if (!page) throw new NotFoundException('Page not found');

    page.status = status;

    return this.repo.save(page);
  }
}

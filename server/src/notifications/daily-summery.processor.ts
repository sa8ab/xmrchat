import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Queue } from 'bullmq';
import { MoneroUtils } from 'monero-ts';
import { PageSetting } from 'src/page-settings/page-setting.entity';
import { Page } from 'src/pages/page.entity';
import { PageSettingKey } from 'src/shared/constants';
import { Tip } from 'src/tips/tip.entity';
import { In, IsNull, MoreThan, Not, Repository } from 'typeorm';

@Processor('notifications-daily-summary')
export class DailySummaryProcessor extends WorkerHost {
  private readonly logger = new Logger(DailySummaryProcessor.name);
  constructor(
    @InjectRepository(Page)
    private pagesRepo: Repository<Page>,
    @InjectRepository(PageSetting)
    private pageSettingsRepo: Repository<PageSetting>,
    @InjectRepository(Tip)
    private tipsRepo: Repository<Tip>,
    @InjectQueue('notifications-email')
    private emailQueue: Queue,
  ) {
    super();
  }

  async process(job: Job) {
    const pageId = job.data.pageId;
    if (!pageId) {
      throw new BadRequestException('Page ID is required');
    }

    // get page and user

    const page = await this.pagesRepo.findOne({
      where: { id: pageId },
      relations: { user: true },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    // get min threshold

    const pageSettings = await this.pageSettingsRepo.find({
      where: {
        page: { id: page.id },
        key: In([PageSettingKey.MIN_NOTIFICATION_THRESHOLD]),
      },
    });

    const minThreshold = pageSettings.find(
      (setting) => setting.key === PageSettingKey.MIN_NOTIFICATION_THRESHOLD,
    )?.value;

    const minThresholdXmr = minThreshold
      ? MoneroUtils.atomicUnitsToXmr(minThreshold)
      : 0;

    // get tips that are in the past 24 hours, and are more than the threshold, and are paid.

    const tips = await this.tipsRepo.find({
      where: {
        payment: { paidAt: Not(IsNull()) },
        createdAt: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)),
      },
      relations: { payment: true },
    });

    const tipsAboveThreshold = tips.filter(({ payment }) => {
      const paidAmount = MoneroUtils.atomicUnitsToXmr(payment.paidAmount);
      return paidAmount > minThresholdXmr;
    });

    if (!tipsAboveThreshold.length) return;

    // based on active preferences send the notifications
    const totalAmount = tipsAboveThreshold.reduce(
      (acc, { payment }) =>
        acc + MoneroUtils.atomicUnitsToXmr(payment.paidAmount),
      0,
    );
    this.logger.log(tipsAboveThreshold, totalAmount);

    await this.emailQueue.add('send-email', {
      to: page.user.email,
      options: {
        subject: 'Daily Summary',
        template: 'daily-summary.hbs',
        context: {
          tips: tipsAboveThreshold.map(({ name, payment, message }) => {
            return {
              name,
              amount: MoneroUtils.atomicUnitsToXmr(payment.paidAmount),
              message,
            };
          }),
          totalAmount,
        },
      },
    });
  }
}

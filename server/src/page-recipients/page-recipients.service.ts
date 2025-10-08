import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRecipientsDto } from './dtos/update-recipient.dto';
import { PageRecipient } from './page-recipient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { PagesService } from 'src/pages/pages.service';
import { Page } from 'src/pages/page.entity';
import { PageRecipientVariant } from 'src/shared/constants';
import { TipRecipientDto } from 'src/tips/dtos/tip-recipient.dto';
import { ConfigService } from '@nestjs/config';
import { generateMoneroUriFromTipRecipients } from 'src/shared/utils/monero';
import { MoneroUtils } from 'monero-ts';
import { Swap } from 'src/swaps/swap.entity';

@Injectable()
export class PageRecipientsService {
  private logger = new Logger(PageRecipientsService.name);

  constructor(
    @InjectRepository(PageRecipient)
    private repo: Repository<PageRecipient>,
    @InjectRepository(Page)
    private pageRepo: Repository<Page>,
    @InjectRepository(Swap)
    private swapRepo: Repository<Swap>,
    private pagesService: PagesService,
    private configService: ConfigService,
  ) {}

  async findMyRecipients(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found!');

    const recipients = await this.repo.find({
      where: { page: { id: page.id } },
    });

    return recipients;
  }

  async updateRecipients(dto: UpdateRecipientsDto, user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found!');

    const newRecipients = dto.recipients.map((recipientDto) => {
      const recipient = this.repo.create({
        name: recipientDto.name,
        address: recipientDto.address,
        percentage: recipientDto.percentage,
        variant: recipientDto.variant,
      });
      return recipient;
    });

    await this.repo.manager.transaction(async (manager) => {
      await manager.delete(PageRecipient, {
        page: { id: page.id },
      });

      page.recipients = newRecipients;
      await manager.save(page);

      return page.recipients;
    });

    await this.updatePagePremium(page.id);
  }

  async resetRecipients(user: User) {
    const page = await this.pagesService.findMyPage(user);
    if (!page) throw new NotFoundException('Page not found!');

    page.recipients = [];
    await this.pageRepo.save(page);

    await this.updatePagePremium(page.id);
  }

  async updatePagePremium(pageId: number) {
    this.logger.warn('Updating page premium is manual. Skipping...');
    return;
    const page = await this.pageRepo.findOne({ where: { id: pageId } });
    if (!page) throw new NotFoundException('Page not found!');

    const xmrchatRecipient = await this.repo.findOne({
      where: {
        variant: PageRecipientVariant.XMRCHAT,
        page: { id: page.id },
      },
    });

    const isPremium = xmrchatRecipient && xmrchatRecipient.percentage >= 3;

    page.isPremium = Boolean(isPremium);
    await this.pageRepo.save(page);

    return isPremium;
  }

  async handleRecipientsAndAmounts({
    pageId,
    tipId,
    amount, // XMR
    integratedAddress,
  }: {
    pageId: number;
    tipId: number;
    amount: number;
    integratedAddress: string;
  }): Promise<{
    pageTipRecipient?: TipRecipientDto;
    tipRecipients: TipRecipientDto[];
    recipientsActive?: boolean;
    url?: string;
  }> {
    const page = await this.pageRepo.findOne({
      where: { id: pageId },
      relations: {
        recipients: true,
      },
    });

    if (!page) throw new NotFoundException('Page not found!');

    const swap = await this.swapRepo.findOne({ where: { tip: { id: tipId } } });

    const recipients = page.recipients;
    const isRecipientsActive = this.getIsRecipientsActive(page.recipients);

    if (!isRecipientsActive || swap) return { tipRecipients: [] };

    const xmrchatAddress = this.configService.get('XMRCHAT_WALLET_ADDRESS');
    const xmrchatRecipient = recipients.find(
      ({ variant }) => variant === PageRecipientVariant.XMRCHAT,
    );

    // Validate XMRChat address exists
    if (xmrchatRecipient?.percentage && !xmrchatAddress)
      throw new BadRequestException(
        'XMRChat wallet not found, add it using `XMRCHAT_WALLET_ADDRESS` env variable.',
      );

    // fill page and xmrchat addresses
    recipients.forEach((recipient) => {
      if (recipient.variant === PageRecipientVariant.PAGE) {
        recipient.address = integratedAddress;
      }
      if (recipient.variant === PageRecipientVariant.XMRCHAT) {
        recipient.address = xmrchatAddress;
      }
    });

    const amountUnits = MoneroUtils.xmrToAtomicUnits(amount);
    const fullPercentageBig = BigInt(100);

    const tipRecipients = recipients
      .filter((recipient) => Boolean(recipient.percentage))
      .map((recipient) => {
        const percentageBig = BigInt(recipient.percentage || 0);
        const amountBig = (amountUnits * percentageBig) / fullPercentageBig;
        const amountXMR = MoneroUtils.atomicUnitsToXmr(amountBig);
        return {
          ...recipient,
          amount: amountXMR,
        };
      });

    const pageTipRecipient = tipRecipients.find(
      (recipient) => recipient.variant === PageRecipientVariant.PAGE,
    );

    const url = generateMoneroUriFromTipRecipients(tipRecipients);

    return {
      pageTipRecipient,
      tipRecipients,
      recipientsActive: isRecipientsActive,
      url,
    };
  }

  // amount in xmr
  async getPageAmount(pageId: number, tipId: number, amount: number) {
    const { pageTipRecipient } = await this.handleRecipientsAndAmounts({
      pageId,
      tipId,
      amount,
      integratedAddress: '',
    });
    return pageTipRecipient?.amount || 0;
  }

  getIsRecipientsActive(recipients: PageRecipient[]) {
    if (!recipients.length || recipients.length === 1) return false;

    const pageRecipient = recipients.find(
      (recipient) => recipient.variant === PageRecipientVariant.PAGE,
    );

    if (!pageRecipient) return false;

    if (pageRecipient.percentage == 100) return false;

    return true;
  }
}

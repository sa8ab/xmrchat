import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class PageRecipientsService {
  constructor(
    @InjectRepository(PageRecipient)
    private repo: Repository<PageRecipient>,
    @InjectRepository(Page)
    private pageRepo: Repository<Page>,
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

  async updatePagePremium(pageId: number) {
    const page = await this.pageRepo.findOne({ where: { id: pageId } });
    if (!page) throw new NotFoundException('Page not found!');

    const xmrchatRecipient = await this.repo.findOne({
      where: {
        variant: PageRecipientVariant.XMRCHAT,
        page: { id: page.id },
      },
    });

    const isPremium = xmrchatRecipient && xmrchatRecipient.percentage >= 3;

    page.isPremium = isPremium;
    await this.pageRepo.save(page);

    console.log(`Is premium: ${isPremium}`);

    return isPremium;
  }

  async handleRecipientsAndAmounts(
    pageId: number,
    amount: number,
    integratedAddress: string,
  ): Promise<{
    pageTipRecipient?: TipRecipientDto;
    tipRecipients: TipRecipientDto[];
    recipientsActive?: boolean;
  }> {
    const page = await this.pageRepo.findOne({
      where: { id: pageId },
      relations: {
        recipients: true,
      },
    });

    if (!page) throw new NotFoundException('Page not found!');

    const recipients = page.recipients;

    const isRecipientsActive = this.getIsRecipientsActive(page.recipients);

    if (!isRecipientsActive) return { tipRecipients: [] };

    const xmrchatAddress = this.configService.get('XMRCHAT_WALLET_ADDRESS');
    const xmrchatRecipient = recipients.find(
      ({ variant }) => variant === PageRecipientVariant.XMRCHAT,
    );

    if (xmrchatRecipient.percentage && !xmrchatAddress)
      throw new BadRequestException('XMRChat wallet not found');

    // fill page and xmrchat addresses
    recipients.forEach((recipient) => {
      if (recipient.variant === PageRecipientVariant.PAGE) {
        recipient.address = integratedAddress;
      }
      if (recipient.variant === PageRecipientVariant.XMRCHAT) {
        recipient.address = xmrchatAddress;
      }
    });

    const tipRecipients = recipients.map((recipient) => {
      return {
        ...recipient,
        amount: (amount * recipient.percentage) / 100,
      };
    });

    const pageTipRecipient = tipRecipients.find(
      (recipient) => recipient.variant === PageRecipientVariant.PAGE,
    );

    return {
      pageTipRecipient,
      tipRecipients,
      recipientsActive: isRecipientsActive,
    };
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

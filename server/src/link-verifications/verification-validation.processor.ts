import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import { LinkVerificationsService } from './link-verifications.service';
import { TwitterVerificationHandler } from './handlers/twitter-verification.handler';
import { LinkPlatformEnum } from 'src/shared/constants';
import { NotificationsService } from 'src/notifications/notifications.service';

@Processor('link-verification-validation')
export class VerificationValidationProcessor extends WorkerHost {
  private readonly logger = new Logger(VerificationValidationProcessor.name);
  constructor(
    private linkVerificationsService: LinkVerificationsService,
    private twitterVerificationHandler: TwitterVerificationHandler,
    private notificationsService: NotificationsService,
  ) {
    super();
  }

  async process(job: Job) {
    const verificationId = job.data.verificationId;
    if (!verificationId) {
      throw new BadRequestException('Verification ID is required');
    }

    const verification = await this.linkVerificationsService.findOneOptional(verificationId);
    if (!verification) throw new NotFoundException('Verification not found');

    const linkType = verification.link.platform;
    if (linkType === LinkPlatformEnum.X) {
      const result = await this.twitterVerificationHandler.validate(verification);

      if (result.valid) return

      // remove verification and email user that the verification is removed.

      await this.linkVerificationsService.deleteById(verification.id);

      const linkValue = verification.link.value || '';
      const user = verification.link.page?.user;

      await this.notificationsService.sendVerificationRemovedEmail({
        to: user.email,
        platform: LinkPlatformEnum.X,
        account: linkValue,
      });

    } else {
      throw new BadRequestException('Only verification of X is supported.');
    }
  }

}

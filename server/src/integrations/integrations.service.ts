import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectSimplexDto } from './dto/connect-simplex.dto';
import { User } from 'src/users/user.entity';
import { PagesService } from 'src/pages/pages.service';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegrationConfig } from './integration-configs.entity';
import { In, Repository } from 'typeorm';
import { IntegrationConfigType } from 'src/shared/constants';
import { SimplexService } from './simplex/simplex.service';
import { ConnectSignalDto } from './dto/connect-signal.dto';
import { SignalService } from './signal/signal.service';
import { ConfirmDto } from './dto/confirm.dto';
import { Page } from 'src/pages/page.entity';

@Injectable()
export class IntegrationsService {
  constructor(
    private pagesService: PagesService,
    private simplexService: SimplexService,
    private signalService: SignalService,
    @InjectRepository(IntegrationConfig)
    private icRepo: Repository<IntegrationConfig>,
  ) {}

  async findAllConfigs(user: User) {
    const page = await this.pagesService.findMyPage(user);
    const configs = await this.icRepo.find({
      where: {
        page: { id: page.id },
      },
    });

    return configs;
  }

  async findOrCreateConfigByPageAndType(
    pageId: number,
    type: IntegrationConfigType,
  ) {
    let config = await this.icRepo.findOne({
      where: {
        page: { id: pageId },
        type,
      },
    });

    if (!config) {
      config = this.icRepo.create({
        page: { id: pageId },
        type,
      });
      config = await this.icRepo.save(config);
    }

    return config;
  }

  async previewConfirmation(pageId: number, type: IntegrationConfigType) {
    const config = await this.icRepo.findOne({
      where: {
        page: { id: pageId },
        type,
      },
    });

    if (!config) {
      throw new NotFoundException('Integration not found');
    }

    if (config.verified) {
      throw new BadRequestException('Integration is already verified.');
    }

    return config;
  }

  async connectSimplex(body: ConnectSimplexDto, user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const config = await this.findOrCreateConfigByPageAndType(
      page.id,
      IntegrationConfigType.SIMPLEX,
    );

    if (config && config.verified) {
      throw new BadRequestException(
        'Simplex is already verified. If you want to change the account disconnect/unlink it first.',
      );
    }

    // add address to integration config
    const connId = await this.simplexService.connectContact(body.address);
    config.config = {
      connectLink: body.address,
      connId,
    };

    await this.icRepo.save(config);
  }

  async confirmSimplex(body: ConfirmDto, user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const config = await this.previewConfirmation(
      page.id,
      IntegrationConfigType.SIMPLEX,
    );

    await this.simplexService.confirmVerification(config, body.code);
  }

  async disconnectSimplex(user: User) {
    await this.disconnect(user, IntegrationConfigType.SIMPLEX);
  }

  async connectSignal(body: ConnectSignalDto, user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const config = await this.findOrCreateConfigByPageAndType(
      page.id,
      IntegrationConfigType.SIGNAL,
    );

    if (config && config.verified) {
      throw new BadRequestException(
        'Signal is already verified. If you want to change the number disconnect/unlink it first.',
      );
    }

    config.config = { number: body.number };
    await this.signalService.requestVerification(config);
    await this.icRepo.save(config);
  }

  async confirmSignal(body: ConfirmDto, user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const config = await this.previewConfirmation(
      page.id,
      IntegrationConfigType.SIGNAL,
    );

    await this.signalService.confirmVerification(config, body.code);
  }

  async disconnectSignal(user: User) {
    await this.disconnect(user, IntegrationConfigType.SIGNAL);
  }

  async disconnect(user: User, type: IntegrationConfigType) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const config = await this.icRepo.findOne({
      where: {
        page: { id: page.id },
        type,
      },
    });

    if (!config) {
      throw new NotFoundException('Integration not found');
    }

    config.verified = false;
    config.config = null;
    config.verificationCode = null;
    config.verificationExpiresAt = null;
    await this.icRepo.save(config);
  }
}

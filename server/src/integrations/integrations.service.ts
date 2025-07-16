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
import { ConfirmSignalDto } from './dto/confirm-signal.dto';

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

  async connectSimplex(body: ConnectSimplexDto, user: User) {
    // get contact address, get user, get page
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    let config = await this.icRepo.findOne({
      where: {
        page: { id: page.id },
        type: IntegrationConfigType.SIMPLEX,
      },
    });
    if (!config) {
      const create = this.icRepo.create({
        page: { id: page.id },
        type: IntegrationConfigType.SIMPLEX,
        config: {
          connectLink: body.address,
        },
      });
      config = await this.icRepo.save(create);
    }

    // add address to integration config
    const connId = await this.simplexService.connectContact(body.address);
    config.config.connectLink = body.address;
    config.config.connId = connId;

    await this.icRepo.save(config);
  }

  async connectSignal(body: ConnectSignalDto, user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    let config = await this.icRepo.findOne({
      where: {
        page: { id: page.id },
        type: IntegrationConfigType.SINGAL,
      },
    });

    if (!config) {
      const created = this.icRepo.create({
        page: { id: page.id },
        type: IntegrationConfigType.SINGAL,
      });
      config = await this.icRepo.save(created);
    }

    if (config && config.verified) {
      throw new BadRequestException(
        'Signal is already verified. If you want to change the number disconnect/unlink it first.',
      );
    }

    config.config = { number: body.number };
    await this.icRepo.save(config);
    await this.signalService.requestVerification(config);
  }

  async confirmSignal(body: ConfirmSignalDto, user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const config = await this.icRepo.findOne({
      where: {
        page: { id: page.id },
        type: IntegrationConfigType.SINGAL,
      },
    });

    if (!config) {
      throw new NotFoundException('Signal not found');
    }

    if (config.verified) {
      throw new BadRequestException('Signal is already verified.');
    }

    await this.signalService.confirmVerification(config, body.code);
  }

  async disconnectSignal(user: User) {
    const page = await this.pagesService.findMyPage(user);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const config = await this.icRepo.findOne({
      where: {
        page: { id: page.id },
        type: IntegrationConfigType.SINGAL,
      },
    });

    if (!config) {
      throw new NotFoundException('Signal not found');
    }

    config.verified = false;
    config.config = null;
    config.verificationCode = null;
    config.verificationExpiresAt = null;
    await this.icRepo.save(config);
  }
}

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

@Injectable()
export class IntegrationsService {
  constructor(
    private pagesService: PagesService,
    private simplexService: SimplexService,
    @InjectRepository(IntegrationConfig)
    private icRepo: Repository<IntegrationConfig>,
  ) {}

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

    // after accepting ( from simplex service ) add contact information to integration config
  }
}

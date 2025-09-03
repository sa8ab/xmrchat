import { Controller, Logger, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller('__test__')
export class TestController {
  private logger = new Logger(TestController.name);

  constructor(private readonly testService: TestService) {}

  @Post('seed')
  @IsPublic()
  async seed() {
    this.logger.log('Running seed');

    await this.testService.init();
  }
}

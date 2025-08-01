import { Controller, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';

@Controller('__test__')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('seed')
  @IsPublic()
  async seed() {
    console.log('Running seed');

    await this.testService.init();
  }
}

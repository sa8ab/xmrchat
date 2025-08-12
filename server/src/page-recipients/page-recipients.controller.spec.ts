import { Test, TestingModule } from '@nestjs/testing';
import { PageRecipientsController } from './page-recipients.controller';

describe('PageRecipientsController', () => {
  let controller: PageRecipientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageRecipientsController],
    }).compile();

    controller = module.get<PageRecipientsController>(PageRecipientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

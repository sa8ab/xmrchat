import { Test, TestingModule } from '@nestjs/testing';
import { SignalService } from './signal.service';

describe('SignalService', () => {
  let service: SignalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignalService],
    }).compile();

    service = module.get<SignalService>(SignalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

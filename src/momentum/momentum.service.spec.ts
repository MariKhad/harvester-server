import { Test, TestingModule } from '@nestjs/testing';
import { MomentumService } from './momentum.service';

describe('MomentumService', () => {
  let service: MomentumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MomentumService],
    }).compile();

    service = module.get<MomentumService>(MomentumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

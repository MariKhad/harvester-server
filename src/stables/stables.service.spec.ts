import { Test, TestingModule } from '@nestjs/testing';
import { StablesService } from './stables.service';

describe('StablesService', () => {
  let service: StablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StablesService],
    }).compile();

    service = module.get<StablesService>(StablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

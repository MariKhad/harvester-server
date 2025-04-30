import { Test, TestingModule } from '@nestjs/testing';
import { BluefinService } from './bluefin.service';

describe('BluefinService', () => {
  let service: BluefinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BluefinService],
    }).compile();

    service = module.get<BluefinService>(BluefinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

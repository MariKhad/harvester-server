import { Test, TestingModule } from '@nestjs/testing';
import { StablesController } from './stables.controller';

describe('StablesController', () => {
  let controller: StablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StablesController],
    }).compile();

    controller = module.get<StablesController>(StablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MomentumController } from './momentum.controller';

describe('MomentumController', () => {
  let controller: MomentumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MomentumController],
    }).compile();

    controller = module.get<MomentumController>(MomentumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

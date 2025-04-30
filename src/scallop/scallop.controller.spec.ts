import { Test, TestingModule } from '@nestjs/testing';
import { ScallopController } from './scallop.controller';

describe('ScallopController', () => {
  let controller: ScallopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScallopController],
    }).compile();

    controller = module.get<ScallopController>(ScallopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

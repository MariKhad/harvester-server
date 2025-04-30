import { Test, TestingModule } from '@nestjs/testing';
import { BluefinController } from './bluefin.controller';

describe('BluefinController', () => {
  let controller: BluefinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BluefinController],
    }).compile();

    controller = module.get<BluefinController>(BluefinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

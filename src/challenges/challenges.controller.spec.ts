import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

describe('ChallengesController', () => {
  let controller: ChallengesController;
  let challengesService: ChallengesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [ChallengesService],
    }).compile();

    controller = module.get<ChallengesController>(ChallengesController);
    challengesService = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(challengesService).toBeDefined();
  });
});

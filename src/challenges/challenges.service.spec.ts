import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesService } from './challenges.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengesInterface } from './interfaces/challenges.interface';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let challengeModel: Model<ChallengesInterface>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        {
          provide: getModelToken('challenges'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    challengeModel = module.get<Model<ChallengesInterface>>(
      getModelToken('challenges'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(challengeModel).toBeDefined();
  });
});

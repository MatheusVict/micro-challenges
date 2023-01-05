import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ProxymqModule } from 'src/proxymq/proxymq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interfaces/challenge.schema';

@Module({
  imports: [
    ProxymqModule,
    MongooseModule.forFeature([
      { name: 'challenges', schema: ChallengeSchema },
    ]),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}

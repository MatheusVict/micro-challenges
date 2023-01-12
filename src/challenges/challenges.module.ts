import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { ProxymqModule } from 'src/proxymq/proxymq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'challenges', schema: ChallengeSchema },
    ]),
    ProxymqModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}

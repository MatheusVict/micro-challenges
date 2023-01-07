import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { ProxymqModule } from 'src/proxymq/proxymq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './interfaces/match.schema';
import { ChallengesModule } from 'src/challenges/challenges.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'match', schema: MatchSchema }]),
    ProxymqModule,
    ChallengesModule,
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}

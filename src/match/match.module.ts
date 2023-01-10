import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { ProxymqModule } from 'src/proxymq/proxymq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './interfaces/match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'match', schema: MatchSchema }]),
    ProxymqModule,
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}

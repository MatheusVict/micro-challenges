import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { ProxymqModule } from 'src/proxymq/proxymq.module';

@Module({
  imports: [ProxymqModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}

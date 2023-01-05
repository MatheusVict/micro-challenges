import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchModule } from './match/match.module';
import { ProxymqModule } from './proxymq/proxymq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.BD_CONNECTION_URI, {
      autoCreate: true,
      autoIndex: true,
    }),
    ChallengesModule,
    MatchModule,
    ProxymqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

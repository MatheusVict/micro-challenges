import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { MatchInterface } from './interfaces/match.interface';
import { MatchService } from './match.service';

const ackErrors = ['E11000'];

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  private readonly logger = new Logger(MatchController.name);

  @EventPattern('criar-partida')
  async createMatch(
    @Payload() match: MatchInterface,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      this.logger.log(`partida: ${JSON.stringify(match)}`);
      await this.matchService.createMatch(match);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.log(`error com match: ${JSON.stringify(error.message)}`);
      await channel.ack(originMessage);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originMessage);
      }
      throw new RpcException(error.message);
    }
  }
}

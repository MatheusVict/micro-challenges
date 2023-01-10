import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ChallengesInterface } from './interfaces/challenges.interface';
import { ChallengesService } from './challenges.service';

const ackErros: string[] = ['E11000'];

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @EventPattern('criar-desafio')
  async createChallenge(
    @Payload() challenge: ChallengesInterface,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      this.logger.log(challenge);
      await this.challengesService.createChallenge(challenge);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.error(JSON.stringify(error.message));
      const filterAckErros = ackErros.filter((ackErro) =>
        error.message.includes(ackErro),
      );

      if (filterAckErros.length > 0) await channel.ack(originMessage);
    }
  }

  @MessagePattern('consultar-desafio')
  async findChallenges(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<ChallengesInterface[] | ChallengesInterface> {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      const idplayer: string = data.idplayer;
      const _id: string = data._id;
      this.logger.log(`Controller de busca desafio ${JSON.stringify(data)}`);

      if (idplayer) {
        return await this.challengesService.getChallengesofPlayer(idplayer);
      } else if (_id) {
        return await this.challengesService.getChallengeForId(_id);
      } else {
        return await this.challengesService.getAllChallenges();
      }
    } finally {
      await channel.ack(originMessage);
    }
  }

  @EventPattern('atualizar-desafio')
  async updateChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      const _id: string = data.idchallenge;
      const challenge: ChallengesInterface = data.challengeBody;
      await this.challengesService.updateChallenge(_id, challenge);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.error(JSON.stringify(error.message));
      const filterAckErros = ackErros.filter((ackErro) =>
        error.message.includes(ackErro),
      );

      if (filterAckErros.length > 0) await channel.ack(originMessage);
    }
  }

  @EventPattern('atualizar-desafio-partida')
  async updateChallengeMatch(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      this.logger.log(`atualizar desafio da partida ${data}`);
      const idMatch: string = data.idMatch;
      const challenge: ChallengesInterface = data.challenge;
      await this.challengesService.updateChallengeMatch(idMatch, challenge);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.error(JSON.stringify(error.message));
      const filterAckErros = ackErros.filter((ackErro) =>
        error.message.includes(ackErro),
      );

      if (filterAckErros.length > 0) await channel.ack(originMessage);
    }
  }

  @EventPattern('deletar-desafio')
  async deleteChallenge(
    @Payload() idchallenge: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      await this.challengesService.deleteChallenge(idchallenge);
      await channel.ack(originMessage);
    } catch (error) {
      this.logger.error(JSON.stringify(error.message));
      const filterAckErros = ackErros.filter((ackErro) =>
        error.message.includes(ackErro),
      );

      if (filterAckErros.length > 0) await channel.ack(originMessage);
    }
  }
}

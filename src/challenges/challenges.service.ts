import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengesInterface } from './interfaces/challenges.interface';
import { ChallengeStatus } from './enums/challenges.enum';
import { RpcException } from '@nestjs/microservices';
import * as momentTimezone from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('challenges')
    private readonly challengesModel: Model<ChallengesInterface>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clienteNotifications =
    this.clientProxySmartRanking.getClientProxyNotificationsInstance();

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    challenge: ChallengesInterface,
  ): Promise<ChallengesInterface> {
    try {
      const challengeCreatede = new this.challengesModel(challenge);
      challengeCreatede.DateTimeRequest = new Date();

      // Quando o desafio for criado, definimos o status do desafio como pendente

      challengeCreatede.status = ChallengeStatus.PENDENTE;
      this.logger.log(JSON.stringify(challengeCreatede));
      await challengeCreatede.save();

      return await lastValueFrom(
        this.clienteNotifications.emit('notificacao-novo-desafio', challenge),
      );
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async getAllChallenges(): Promise<ChallengesInterface[]> {
    try {
      return await this.challengesModel.find();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async getChallengesofPlayer(
    _id: any,
  ): Promise<ChallengesInterface[] | ChallengesInterface> {
    try {
      return await this.challengesModel.find().where('players').in(_id);
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async getChallengeForId(_id: string): Promise<ChallengesInterface> {
    try {
      return await this.challengesModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(`Erro em pegar o id ${error.message}`);
    }
  }

  async updateChallenge(
    _id: string,
    challenge: ChallengesInterface,
  ): Promise<void> {
    try {
      challenge.DateTimeResponse = new Date();
      await this.challengesModel.findOneAndUpdate({ _id }, { $set: challenge });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }

  async updateChallengeMatch(
    idMatch: string,
    challenge: ChallengesInterface,
  ): Promise<void> {
    try {
      challenge.status = ChallengeStatus.REALIZADO;
      challenge.match = idMatch;
      await this.challengesModel.findOneAndUpdate(
        { _id: challenge._id },
        { $set: challenge },
      );
    } catch (error) {
      this.logger.error(JSON.stringify(error.message));
      throw new RpcException(error.message);
    }
  }

  async consultChallengesAccomplished(
    idCategory: string,
  ): Promise<ChallengesInterface[]> {
    try {
      return await this.challengesModel
        .find()
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.REALIZADO)
        .exec();
    } catch (error) {
      this.logger.error(`Erro: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultChallengesAccomplishedByDate(
    idCategory: string,
    dataRef: string,
  ) {
    try {
      const dataRefNew = `${dataRef} 23:59:59.999`;
      this.logger.log(
        `Data formatada: ${momentTimezone(dataRefNew).tz('UTC')}`,
      );
      return await this.challengesModel
        .find()
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.REALIZADO)
        .where('DateTimeChallenge', {
          $lte: momentTimezone(dataRefNew)
            .tz('UTC')
            .format('YYYY-MM-DD HH:mm:ss.SSS+00:00'),
        })
        .exec();
    } catch (error) {
      this.logger.error(`Erro: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    try {
      await this.challengesModel.deleteOne({ _id });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
    }
  }
}

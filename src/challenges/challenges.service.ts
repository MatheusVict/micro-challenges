import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengesInterface } from './interfaces/challenges.interface';
import { ChallengeStatus } from './enums/challenges.enum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('challenges')
    private readonly challengesModel: Model<ChallengesInterface>,
  ) {}

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
      return await challengeCreatede.save();
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
      return await this.challengesModel.findOne({ _id });
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(error.message);
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
      this.logger.error(error.message);
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

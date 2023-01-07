import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MatchInterface } from './interfaces/match.interface';
import { Model } from 'mongoose';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';
import { ChallengesInterface } from 'src/challenges/interfaces/challenges.interface';
import { RpcException } from '@nestjs/microservices';
import { ChallengesService } from 'src/challenges/challenges.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('match')
    private readonly matchModel: Model<MatchInterface>,
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
    private readonly challengesService: ChallengesService,
  ) {}
  private readonly logger = new Logger(MatchService.name);

  private clientChallangesProxy =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  async createMatch(match: MatchInterface) {
    try {
      //Iremos persistir a partida e lego em seguida atualizaremos o desafio.
      //O desafio irá receber o ID da partida e seu status será modificado para REALIZADO

      const matchCreated = new this.matchModel(match);
      this.logger.log(`Criando: ${JSON.stringify(match)}`);

      //Recuperamos o ID da partida

      const result = await matchCreated.save();
      this.logger.log(`Id do do desafio: ${JSON.stringify(match.challenge)}`);
      this.logger.log(`Salvando ${JSON.stringify(result)}`);
      const idMatch = result._id;
      this.logger.log(`Id da partida ${JSON.stringify(idMatch)}`);

      //Com o ID do desafio que recebemos na requisição, recuperamos o desafio

      this.logger.log('Pouco antes de erro');

      const challenges: ChallengesInterface =
        await this.challengesService.getChallengeForId(match.challenge);

      //Acionamos o tópico "atualizar-desafio-partida"
      //que será responsável por atualizar o desafio
      this.logger.log(JSON.stringify(challenges));

      await this.challengesService.updateChallengeMatch(idMatch, challenges);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new RpcException(`Match ERRO: ${JSON.stringify(error)}`);
    }
  }
}

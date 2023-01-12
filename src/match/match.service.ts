import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MatchInterface } from './interfaces/match.interface';
import { Model } from 'mongoose';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';
import { ChallengesInterface } from 'src/challenges/interfaces/challenges.interface';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel('match')
    private readonly matchModel: Model<MatchInterface>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}
  private readonly logger = new Logger(MatchService.name);

  private clientChallangesProxy =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  private clientRanking =
    this.clientProxySmartRanking.getClientProxyRankingInstance();

  async createMatch(match: MatchInterface): Promise<MatchInterface> {
    try {
      /*Iremos persistir a partida e logo em seguida atualizaremos o desafio.
      O desafio irá receber o ID da partida e seu status será modificado para REALIZADO*/

      const matchCreated = new this.matchModel(match);

      //Recuperamos o ID da partida

      const result = await matchCreated.save();
      const idMatch = result._id;

      //Com o ID do desafio que recebemos na requisição, recuperamos o desafio
      const challenge: ChallengesInterface = await firstValueFrom(
        this.clientChallangesProxy.send('consultar-desafio', {
          idplayer: '',
          _id: match.challenge,
        }),
      );

      //Acionamos o tópico "atualizar-desafio-partida"
      //que será responsável por atualizar o desafio
      this.logger.log(JSON.stringify(challenge));

      await lastValueFrom(
        this.clientChallangesProxy.emit('atualizar-desafio-partida', {
          idMatch,
          challenge,
        }),
      );

      /*
      Enviamos a partida para o microservice rankings
      indicando a necessidade de processamento de partidas
      */

      return await lastValueFrom(
        this.clientRanking.emit('processar-partida', {
          idMatch,
          match,
        }),
      );
    } catch (error) {
      this.logger.error(JSON.stringify(error.message));
      throw new RpcException(`Match ERRO: ${JSON.stringify(error.message)}`);
    }
  }
}

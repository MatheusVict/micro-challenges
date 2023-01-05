import { Controller, Logger } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy.proxymq';

@Controller('match')
export class MatchController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  private clientAdminBackEnd =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  private readonly logger = new Logger(MatchController.name);
}

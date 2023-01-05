import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  /*
  Mesmo estando no mesmo microservice vão se comunicar por message broker, para implementações futuras
  */

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AWS_RABBITMQ],
        queue: 'admin-backend',
      },
    });
  }

  getClientProxyChallengesInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AWS_RABBITMQ],
        queue: 'challenges',
      },
    });
  }
}

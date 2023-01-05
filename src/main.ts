import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_CONNECTION],
      noAck: false,
      queue: 'challenges',
    },
  });
  await app
    .listen()
    .then(() => logger.log('Microservice online'))
    .catch((erro) => logger.error(erro.message));
}
bootstrap();

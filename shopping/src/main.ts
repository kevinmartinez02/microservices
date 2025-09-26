import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'shopping',
      protoPath: join(__dirname, './protos/shopping.proto'),
      url: `${process.env.SHOPPING_HOST || '0.0.0.0'}:${parseInt(process.env.SHOPPING_GRPC_PORT || '50052', 10)}`,
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3102);
}
bootstrap();

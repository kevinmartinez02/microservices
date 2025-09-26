import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'products',
      protoPath: join(__dirname, './protos/products.proto'),
      url: `${process.env.PRODUCTS_HOST || '0.0.0.0'}:${parseInt(process.env.PRODUCTS_GRPC_PORT || '50051', 10)}`,
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3101);
}
bootstrap();

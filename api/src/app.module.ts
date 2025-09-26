import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'products',
          protoPath: join(__dirname, './protos/products.proto'),
          url: `${process.env.PRODUCTS_HOST || 'products'}:${parseInt(process.env.PRODUCTS_GRPC_PORT || '50051', 10)}`,
        },
      },
      {
        name: 'SHOPPING_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'shopping',
          protoPath: join(__dirname, './protos/shopping.proto'),
          url: `${process.env.SHOPPING_HOST || 'shopping'}:${parseInt(process.env.SHOPPING_GRPC_PORT || '50052', 10)}`,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

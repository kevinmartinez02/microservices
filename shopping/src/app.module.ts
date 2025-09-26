import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { ShoppingController } from './shopping.controller';
import { ShoppingService } from './shopping.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
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
    ]),
  ],
  controllers: [AppController, ShoppingController],
  providers: [AppService, PrismaService, ShoppingService],
})
export class AppModule {}

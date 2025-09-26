import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, ProductsController],
  providers: [AppService, PrismaService, ProductsService],
})
export class AppModule {}

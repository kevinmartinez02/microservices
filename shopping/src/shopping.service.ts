import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { firstValueFrom } from 'rxjs';

interface ProductsServiceGrpc {
  List(request: {}): any;
  DecrementStock(request: { productId: number; quantity: number }): any;
  isThereStock(request: { productId: number }): any;
}

@Injectable()
export class ShoppingService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientGrpc,
  ) {}

  private productsService!: ProductsServiceGrpc;

  onModuleInit() {
    this.productsService = this.productsClient.getService<ProductsServiceGrpc>('ProductsService');
  }

  listPurchases() {
    return this.prisma.shopping.findMany({ orderBy: { id: 'desc' } });
  }

  async purchase(productId: number, quantity: number) {
    const listResp = await firstValueFrom(this.productsService.List({}));
    const items = (listResp as any)?.items as { id: number; name: string; price: number; stock: number }[] | undefined;

    if (!Array.isArray(items)) {
      throw new Error('Invalid products response');
    }

    const target = items.find((p) => p.id === productId);
    if (!target) throw new Error('Product not found');

    const isThereStock = await this.productsService.isThereStock({ productId });
    if (!isThereStock){
      console.log('Producto sin stock');
    };

    await firstValueFrom(this.productsService.DecrementStock({ productId, quantity }));

    return this.prisma.shopping.create({
      data: { productId, name: target.name, price: target.price, quantity },
    });
  }

  
}



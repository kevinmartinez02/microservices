import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @GrpcMethod('ProductsService', 'List')
  async list(_: unknown, __: unknown) {
    const items = await this.products.listProducts();
    return { items };
  }

  @GrpcMethod('ProductsService', 'DecrementStock')
  async decrement(data: { productId: number; quantity: number }) {
    await this.products.decrementStock(data.productId, data.quantity);
    return { success: true };
  }

  
}



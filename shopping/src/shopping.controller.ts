import { Body, Controller, Get, Post } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ShoppingService } from './shopping.service';

@Controller()
export class ShoppingController {
  constructor(private readonly shopping: ShoppingService) {}

  @GrpcMethod('ShoppingService', 'List')
  async list(_: unknown, __: unknown) {
    const items = await this.shopping.listPurchases();
    return { items };
  }

  @GrpcMethod('ShoppingService', 'Purchase')
  async purchase(data: { productId: number; quantity: number }) {
    await this.shopping.purchase(data.productId, data.quantity);
    return { success: true };
  }
}



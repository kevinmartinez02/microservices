import { Controller, Get, Inject, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientGrpc,
    @Inject('SHOPPING_SERVICE') private readonly shoppingClient: ClientGrpc,
  ) {}

  private productsService: any;
  private shoppingService: any;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('products')
  async listProducts() {
    if (!this.productsService) {
      this.productsService = this.productsClient.getService('ProductsService');
    }
    const resp = await firstValueFrom(this.productsService.List({}));
    // Fix: Ensure resp is an object and has 'items' property, otherwise return empty array
    if (resp && Array.isArray((resp as any).items)) {
      return (resp as any).items;
    }
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Get('shopping')
  async listShopping() {
    if (!this.shoppingService) {
      this.shoppingService = this.shoppingClient.getService('ShoppingService');
    }
    const resp = await firstValueFrom(this.shoppingService.List({}));
    // Fix: Ensure resp is an object and has 'items' property, otherwise return empty array
    if (resp && Array.isArray((resp as any).items)) {
      return (resp as any).items;
    }
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopping/purchase')
  async purchase(@Body() body: { productId: number; quantity: number }) {
    if (!this.shoppingService) {
      this.shoppingService = this.shoppingClient.getService('ShoppingService');
    }
    await firstValueFrom(this.shoppingService.Purchase(body));

    return { success: true };
  }
}

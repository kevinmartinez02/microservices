import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  listProducts() {
    return this.prisma.product.findMany({ orderBy: { id: 'asc' } });
  }

  async decrementStock(productId: number, quantity: number) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product || product.stock < quantity) {
        throw new Error('Insufficient stock');
      }
      return tx.product.update({ where: { id: productId }, data: { stock: { decrement: quantity } } });
    });
  }

}



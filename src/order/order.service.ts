import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {id: createOrderDto.walletId}
    })

    if(!wallet){
      throw new NotFoundException('No wallet found');
    }

    const assets = await Promise.all(createOrderDto.assets.map(async ({ticker}) => await this.prisma.asset.findFirst({
      where: {
        ticker
      }
    })))

    const assetWalletDTO = assets.map((asset)=>{
      const {quantity, ticker} = createOrderDto.assets.find((assetInput) => assetInput.ticker === asset.ticker)
      return {
        ticker,
        boughtAt: new Date(),
        quantity,
        walletId: createOrderDto.walletId 
      }
    })


    const assetWallet =  await this.prisma.assetWallet.createMany({
      data: {
        ...assetWalletDTO

      }
    })



    const order = await this.prisma.order.create({
      data: {
        status: 'CONFIRMED',
        price: assets.reduce((sum, asset) => sum + Number(asset.price),0),  // You can update with the correct price if needed
        quantity: createOrderDto.assets.reduce((sum, asset) => sum + asset.quantity, 0),  // Example, adjust logic as needed
        assetWallet: {
          connectOrCreate: assetWalletDTO.map((assetWallet) => ({
            where: {
              ticker: assetWallet.ticker
            },
            create: {
              walletId: assetWallet.walletId,
              ticker: assetWallet.ticker,
              boughtAt: assetWallet.boughtAt,
              quantity: assetWallet.quantity
            }
          }))
        }
      }
    });
  }

  async findAll() {
    const orders = await this.prisma.order.findMany();
    if (!orders.length) {
      throw new NotFoundException('No orders found');
    }
    return orders;
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });
      return updatedOrder;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
    }
  }

  async remove(id: number) {
    try {
      const deletedOrder = await this.prisma.order.delete({
        where: { id },
      });
      return deletedOrder;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
    }
  }
}

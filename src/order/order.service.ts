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
      where: { id: createOrderDto.walletId }
    });
  
    if (!wallet) {
      throw new NotFoundException('No wallet found');
    }
  
    // Fetch assets based on tickers provided in the order
    const assets = await Promise.all(
      createOrderDto.assets.map(async ({ ticker }) =>
        await this.prisma.asset.findFirst({
          where: {
            ticker
          }
        })
      )
    );
  
    // Create AssetWalletDTO that contains the asset wallet details
    const assetWalletDTO = assets.map((asset) => {
      const { quantity, ticker } = createOrderDto.assets.find(
        (assetInput) => assetInput.ticker === asset.ticker
      );
      return {
        ticker: asset.id,  // Here we use asset.id, assuming it's an integer
        boughtAt: new Date(),
        quantity,
        walletId: createOrderDto.walletId
      };
    });
  
    // Map to prepare the asset details for the order creation
    const assetMapper = assets.map((asset) => {
      const { quantity, ticker } = createOrderDto.assets.find(
        (assetInput) => assetInput.ticker === asset.ticker
      );
      return {
        ticker: asset.id,  // Again, use asset.id here
        price: asset.price,
        quantity,
        walletId: createOrderDto.walletId
      };
    });
  
    // Calculate the total price of the order
    const totalPrice = assetMapper.reduce(
      (sum, asset) => sum + Number(asset.price) * asset.quantity,
      0
    );
  
    // Create the order and connect/create AssetWallets
    const order = await this.prisma.order.create({
      data: {
        status: 'CONFIRMED',
        price: totalPrice,
        quantity: createOrderDto.assets.reduce((sum, asset) => sum + asset.quantity, 0),
        assetWallet: {
          connectOrCreate: assetWalletDTO.map((assetWallet) => ({
            where: {
              walletId_ticker: {
                walletId: assetWallet.walletId,  // Composite unique key
                ticker: assetWallet.ticker
              }
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
  
    // Update the wallet with the new total invested amount
    await this.prisma.wallet.update({
      where: {
        id: createOrderDto.walletId
      },
      data: {
        totalInvested: Number(wallet.totalInvested) + totalPrice
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

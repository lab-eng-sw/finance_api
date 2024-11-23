import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { walletId, assets } = createOrderDto;

    return await this.prisma.$transaction(async (prisma) => {
      const wallet = await prisma.wallet.findUnique({
        where: { id: walletId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      const orderAssetsData = [];
      let totalOrderPrice = new Prisma.Decimal(0);
      let totalQuantity = 0;

      for (const assetInput of assets) {

        const asset = await prisma.asset.findFirst({
          where: { ticker: assetInput.ticker },
          orderBy: { date: 'desc' },
        });

        if (!asset) {
          throw new NotFoundException(
            `Asset with ticker ${assetInput.ticker} not found`,
          );
        }

        const assetPrice = asset.price;
        const totalAssetPrice = assetPrice?.times(assetInput.quantity);

        totalOrderPrice = totalOrderPrice?.plus(totalAssetPrice);
        totalQuantity += assetInput.quantity;

        orderAssetsData.push({
          assetId: asset.id,
          quantity: assetInput.quantity,
          price: assetPrice,
        });
      }

      const order = await prisma.order.create({
        data: {
          status: 'CONFIRMED',
          price: totalOrderPrice,
          quantity: totalQuantity,
          walletId: walletId,
          assets: {
            create: orderAssetsData,
          },
        },
        include: {
          assets: {
            include: {
              asset: true,
            },
          },
        },
      });
      await prisma.wallet.update({
        where: { id: walletId },
        data: {
          totalInvested: wallet.totalInvested.plus(totalOrderPrice),
        },
      });

      return order;
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
      const { assets, status } = updateOrderDto;

      return await this.prisma.$transaction(async (prisma) => {
        const existingOrder = await prisma.order.findUnique({
          where: { id },
          include: {
            assets: true,
          },
        });

        if (!existingOrder) {
          throw new NotFoundException(`Order with ID ${id} not found`);
        }

        let totalOrderPrice = existingOrder.price;
        let totalQuantity = existingOrder.quantity;

        let assetsData = undefined;
        if (assets) {

          totalOrderPrice = new Prisma.Decimal(0);
          totalQuantity = 0;

          await prisma.orderAsset.deleteMany({
            where: { orderId: id },
          });


          const orderAssetsData = [];

          for (const assetInput of assets) {
            const asset = await prisma.asset.findFirst({
              where: { ticker: assetInput.ticker },
              orderBy: { date: 'desc' },
            });

            if (!asset) {
              throw new NotFoundException(
                `Asset with ticker ${assetInput.ticker} not found`,
              );
            }

            const assetPrice = asset.price;
            const totalAssetPrice = assetPrice.times(assetInput.quantity);

            totalOrderPrice = totalOrderPrice.plus(totalAssetPrice);
            totalQuantity += assetInput.quantity;

            orderAssetsData.push({
              assetId: asset.id,
              quantity: assetInput.quantity,
              price: assetPrice,
            });
          }

          assetsData = {
            create: orderAssetsData,
          };
        }

        const updatedOrder = await prisma.order.update({
          where: { id },
          data: {
            status,
            price: totalOrderPrice,
            quantity: totalQuantity,
            assets: assetsData,
          },
          include: {
            assets: {
              include: {
                asset: true,
              },
            },
          },
        });

        return updatedOrder;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      throw error;
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

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
    return 'This action adds a new order';
  }

  async findAll() {
    const orders = await this.prisma.order.findMany();
    if (!orders.length) {
      throw new NotFoundException('No orders found');
    }
    return orders;
  }

  async findOne(id: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error getting order');
    }
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
      console.error(error);
      throw new InternalServerErrorException('Error updating order');
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
      console.error(error);
      throw new InternalServerErrorException('Error removing order');
    }
  }
}

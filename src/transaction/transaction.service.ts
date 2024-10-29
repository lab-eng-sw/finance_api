import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  async findAll() {
    const transactions = await this.prisma.transactionRecord.findMany();
    if (!transactions.length) {
      throw new NotFoundException('No transactions found');
    }
    return transactions;
  }

  async findOne(id: number) {
    const transaction = await this.prisma.transactionRecord.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      const updatedTransaction = await this.prisma.transactionRecord.update({
        where: { id },
        data: updateTransactionDto,
      });
      return updatedTransaction;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }
    }
  }

  async remove(id: number) {
    try {
      const deletedTransaction = await this.prisma.transactionRecord.delete({
        where: { id },
      });
      return deletedTransaction;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }
    }
  }
}

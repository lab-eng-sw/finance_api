import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }

  async findAll() {
    const wallets = await this.prisma.wallet.findMany();
    if (!wallets.length) {
      throw new NotFoundException('No wallets found');
    }
    return wallets;
  }

  async findOne(id: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
      include: { assets: true },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    return wallet;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}

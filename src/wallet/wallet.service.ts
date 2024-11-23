import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWalletDto: CreateWalletDto) {
    return await this.prisma.wallet.create({
      data: createWalletDto,
    });
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

  async update(id: number, updateWalletDto: UpdateWalletDto) {
    const { assets } = updateWalletDto;

    return await this.prisma.$transaction(async (prisma) => {
      let totalInvestment = new Prisma.Decimal(0);

      for (const assetData of assets) {
        const { ticker, quantity } = assetData;

        const asset = await prisma.asset.findFirst({
          where: { ticker },
        });

        if (!asset) {
          throw new NotFoundException(`Asset with ticker ${ticker} not found`);
        }

        const assetPrice = asset.price;
        const investmentAmount = assetPrice.times(quantity);
        totalInvestment = totalInvestment.plus(investmentAmount);

        await prisma.assetWallet.upsert({
          where: {
            assetId_walletId: {
              assetId: asset.id,
              walletId: id,
            },
          },
          update: {
            quantity: {
              increment: quantity,
            },
          },
          create: {
            assetId: asset.id,
            walletId: id,
            quantity,
            boughtAt: new Date(),
          },
        });
      }

      await prisma.wallet.update({
        where: { id },
        data: {
          totalInvested: {
            increment: totalInvestment,
          },
        },
      });

      return prisma.wallet.findUnique({
        where: { id },
        include: {
          assets: true,
        },
      });
    });
  }

  async remove(id: number) {
    try {
      const deletedWallet = await this.prisma.wallet.delete({
        where: { id },
      });
      return deletedWallet;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }
      throw error;
    }
  }
}

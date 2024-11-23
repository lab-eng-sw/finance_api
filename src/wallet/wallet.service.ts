import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWalletDto: CreateWalletDto) {
    try {
      return await this.prisma.wallet.create({
        data: createWalletDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const wallets = await this.prisma.wallet.findMany();
      if (!wallets.length) {
        throw new NotFoundException('No wallets found');
      }
      return wallets;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { id },
        include: { assets: true },
      });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }
      return wallet;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateWalletDto: UpdateWalletDto) {
    try {
      const { assets, ...rest } = updateWalletDto;

      const wallet = await this.prisma.wallet.findUnique({
        where: { id },
      });
    
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }

      return await this.prisma.$transaction(async (prisma) => {
        let totalInvestment = new Prisma.Decimal(0);

        if (assets && assets.length > 0) {
          for (const assetData of assets) {
            const { ticker, quantity } = assetData;

            if (quantity < 0) {
              throw new BadRequestException(
                'Asset quantity cannot be negative',
              );
            }

            const asset = await prisma.asset.findFirst({
              where: { ticker },
            });

            if (!asset) {
              throw new NotFoundException(
                `Asset with ticker ${ticker} not found`,
              );
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
              ...rest,
            },
          });
        } else {
          await prisma.wallet.update({
            where: { id },
            data: {
              ...rest,
            },
          });
        }

        return prisma.wallet.findUnique({
          where: { id },
          include: {
            assets: true,
          },
        });
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      } else if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const deletedWallet = await this.prisma.wallet.delete({
        where: { id },
      });
      return deletedWallet;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}

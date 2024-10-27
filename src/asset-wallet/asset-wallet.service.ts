import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAssetWalletDto } from './dto/create-asset-wallet.dto';
import { UpdateAssetWalletDto } from './dto/update-asset-wallet.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssetWalletService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssetWalletDto: CreateAssetWalletDto) {
    return 'This action adds a new asset wallet';
  }

  async findAll() {
    try {
      const assetWallets = await this.prisma.assetWallet.findMany();
      if (!assetWallets.length) {
        throw new NotFoundException('No asset wallets found');
      }
      return assetWallets;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching asset wallets');
    }
  }

  async findOne(id: number) {
    try {
      const assetWallet = await this.prisma.assetWallet.findUnique({
        where: { id },
      });
      if (!assetWallet) {
        throw new NotFoundException(`Asset wallet with ID ${id} not found`);
      }
      return assetWallet;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching asset wallet');
    }
  }

  async update(id: number, updateAssetWalletDto: UpdateAssetWalletDto) {
    try {
      const updatedAssetWallet = await this.prisma.assetWallet.update({
        where: { id },
        data: updateAssetWalletDto,
      });
      return updatedAssetWallet;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Asset wallet with ID ${id} not found`);
      }
      console.error(error);
      throw new InternalServerErrorException('Error updating asset wallet');
    }
  }

  async remove(id: number) {
    try {
      const deletedAssetWallet = await this.prisma.assetWallet.delete({
        where: { id },
      });
      return deletedAssetWallet;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Asset wallet with ID ${id} not found`);
      }
      console.error(error);
      throw new InternalServerErrorException('Error removing asset wallet');
    }
  }
}

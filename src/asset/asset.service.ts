import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssetDto: CreateAssetDto) {
    return 'This action adds a new asset';
  }

  async findAll() {
    const assets = await this.prisma.asset.findMany();
    if (!assets.length) {
      throw new NotFoundException('No assets found');
    }
    return assets;
  }

  async findOne(id: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
    });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async update(id: number, updateAssetDto: UpdateAssetDto) {
    try {
      const updatedAsset = await this.prisma.asset.update({
        where: { id },
        data: updateAssetDto,
      });
      return updatedAsset;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Asset with ID ${id} not found`);
      }
    }
  }

  async remove(id: number) {
    try {
      const deletedAsset = await this.prisma.asset.delete({
        where: { id },
      });
      return deletedAsset;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Asset with ID ${id} not found`);
      }
    }
  }
}

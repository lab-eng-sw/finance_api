import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssetDto: CreateAssetDto) {
    const {
      ticker,
      date,
      price,
      volume,
      dailyVariation,
      bbi,
      rsi,
      scom,
      sven,
      assetName,
      type,
      benchmark,
      pl,
      macdim,
      macdis,
      macdh,
      bbs,
      bbl,
      bbm,
      rsicom,
      rsivem,
    } = createAssetDto;

    try {
      const asset = await this.prisma.asset.create({
        data: {
          ticker,
          date: new Date(date),
          price: new Prisma.Decimal(price),
          volume,
          dailyVariation: new Prisma.Decimal(dailyVariation),
          bbi: new Prisma.Decimal(bbi),
          rsi,
          scom: scom ? new Prisma.Decimal(scom) : null,
          sven: new Prisma.Decimal(sven),
          assetName,
          type,
          benchmark,
          pl: new Prisma.Decimal(pl),
          macdim: new Prisma.Decimal(macdim),
          macdis: new Prisma.Decimal(macdis),
          macdh: new Prisma.Decimal(macdh),
          bbs: new Prisma.Decimal(bbs),
          bbl: new Prisma.Decimal(bbl),
          bbm: new Prisma.Decimal(bbm),
          rsicom: new Prisma.Decimal(rsicom),
          rsivem: new Prisma.Decimal(rsivem),
        },
      });
      return asset;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('An asset with this identifier already exists.');
      }
      throw new BadRequestException('Failed to create asset: ' + error.message);
    }
  }

  async findAll(orderBy?: { field: string; direction: 'asc' | 'desc' }) {
    const assets = await this.prisma.asset.findMany({
      orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
    });
  
    if (!assets.length) {
      throw new NotFoundException('No assets found');
    }
  
    return assets;
  }
  

  
  async findOne(filter: { [key: string]: any }) {
    const asset = await this.prisma.asset.findMany({
      where: filter,
      orderBy: { date: 'desc' },
      take: 1,
    });
    if (!asset) {
      throw new NotFoundException(
        `Asset with filter ${JSON.stringify(filter)} not found`,
      );
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

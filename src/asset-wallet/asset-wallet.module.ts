import { Module } from '@nestjs/common';
import { AssetWalletService } from './asset-wallet.service';
import { AssetWalletController } from './asset-wallet.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AssetWalletController],
  providers: [AssetWalletService, PrismaService],
})
export class AssetWalletModule {}

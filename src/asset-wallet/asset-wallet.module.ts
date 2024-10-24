import { Module } from '@nestjs/common';
import { AssetWalletService } from './asset-wallet.service';
import { AssetWalletController } from './asset-wallet.controller';

@Module({
  controllers: [AssetWalletController],
  providers: [AssetWalletService],
})
export class AssetWalletModule {}

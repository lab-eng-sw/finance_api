import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AssetWalletModule } from './asset-wallet/asset-wallet.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { InvestorModule } from './investor/investor.module';
import { OrderModule } from './order/order.module';
import { AssetModule } from './asset/asset.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), AssetWalletModule, WalletModule, TransactionModule, InvestorModule, OrderModule, AssetModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

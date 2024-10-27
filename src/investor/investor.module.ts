import { Module } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { InvestorController } from './investor.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [InvestorController],
  providers: [InvestorService, PrismaService],
})
export class InvestorModule {}

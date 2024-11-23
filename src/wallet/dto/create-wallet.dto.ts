import { Prisma } from '@prisma/client';

export class CreateWalletDto {
  totalInvested: any;
  investorId: number;
  active?: boolean;
}

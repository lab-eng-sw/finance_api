import { Prisma } from '@prisma/client';

export class CreateWalletDto {
  totalInvested: number;
  investorId: number;
  active?: boolean;
}

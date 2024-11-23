/*
  Warnings:

  - You are about to drop the column `assetWalletId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `walletId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TransactionRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_assetWalletId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "assetWalletId",
ADD COLUMN     "walletId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TransactionRecord" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "totalInvested" SET DEFAULT 0.0;

-- CreateTable
CREATE TABLE "OrderAsset" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "assetId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderAsset_orderId_assetId_key" ON "OrderAsset"("orderId", "assetId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAsset" ADD CONSTRAINT "OrderAsset_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderAsset" ADD CONSTRAINT "OrderAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

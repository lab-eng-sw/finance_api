/*
  Warnings:

  - You are about to drop the column `assetWalletId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `ticker` on the `AssetWallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assetId,walletId]` on the table `AssetWallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetId` to the `AssetWallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_assetWalletId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "assetWalletId";

-- AlterTable
ALTER TABLE "AssetWallet" DROP COLUMN "ticker",
ADD COLUMN     "assetId" INTEGER NOT NULL,
ALTER COLUMN "soldAt" DROP NOT NULL,
ALTER COLUMN "profit" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AssetWallet_assetId_walletId_key" ON "AssetWallet"("assetId", "walletId");

-- AddForeignKey
ALTER TABLE "AssetWallet" ADD CONSTRAINT "AssetWallet_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

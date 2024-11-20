/*
  Warnings:

  - You are about to alter the column `price` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `pl` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `macdim` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `macdis` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `macdh` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `bbs` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `bbl` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `bbm` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `rsicom` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `rsivem` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `bbi` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `dailyVariation` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `scom` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `sven` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `profit` on the `AssetWallet` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `price` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalInvested` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Changed the type of `value` on the `TransactionRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `active` on table `Wallet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "pl" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "macdim" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "macdis" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "macdh" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "bbs" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "bbl" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "bbm" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "rsicom" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "rsivem" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "bbi" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "dailyVariation" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "scom" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "sven" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "AssetWallet" ALTER COLUMN "profit" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "TransactionRecord" DROP COLUMN "value",
ADD COLUMN     "value" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "active" SET NOT NULL,
ALTER COLUMN "totalInvested" SET DATA TYPE DECIMAL(65,30);

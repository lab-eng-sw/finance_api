/*
  Warnings:

  - You are about to drop the column `In` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `totalInvested` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "In",
DROP COLUMN "content",
DROP COLUMN "published",
ADD COLUMN     "active" BOOLEAN DEFAULT false,
ADD COLUMN     "totalInvested" DOUBLE PRECISION NOT NULL;

/*
  Warnings:

  - Added the required column `bbi` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyVariation` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sven` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "bbi" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dailyVariation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rsi" INTEGER,
ADD COLUMN     "scom" DOUBLE PRECISION,
ADD COLUMN     "sven" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "volume" INTEGER NOT NULL;

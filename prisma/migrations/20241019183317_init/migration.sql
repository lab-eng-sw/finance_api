-- CreateTable
CREATE TABLE "Investor" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "In" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN DEFAULT false,
    "investorId" INTEGER NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionRecord" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "value" BOOLEAN NOT NULL DEFAULT false,
    "walletId" INTEGER NOT NULL,

    CONSTRAINT "TransactionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetWallet" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "boughtAt" TIMESTAMP(3) NOT NULL,
    "soldAt" TIMESTAMP(3) NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "walletId" INTEGER NOT NULL,

    CONSTRAINT "AssetWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "assetWalletId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "benchmark" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pl" DOUBLE PRECISION NOT NULL,
    "macdim" DOUBLE PRECISION NOT NULL,
    "macdis" DOUBLE PRECISION NOT NULL,
    "macdh" DOUBLE PRECISION NOT NULL,
    "bbs" DOUBLE PRECISION NOT NULL,
    "bbl" DOUBLE PRECISION NOT NULL,
    "bbm" DOUBLE PRECISION NOT NULL,
    "rsicom" DOUBLE PRECISION NOT NULL,
    "rsivem" DOUBLE PRECISION NOT NULL,
    "assetWalletId" INTEGER NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Investor_email_key" ON "Investor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_tax_id_key" ON "Investor"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_investorId_key" ON "Wallet"("investorId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetWallet" ADD CONSTRAINT "AssetWallet_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_assetWalletId_fkey" FOREIGN KEY ("assetWalletId") REFERENCES "AssetWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assetWalletId_fkey" FOREIGN KEY ("assetWalletId") REFERENCES "AssetWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

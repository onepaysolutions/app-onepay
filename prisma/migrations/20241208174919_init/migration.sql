-- CreateEnum
CREATE TYPE "NFTType" AS ENUM ('ANGEL', 'STAR');

-- CreateEnum
CREATE TYPE "NFTStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BURNED');

-- CreateEnum
CREATE TYPE "BurnStatus" AS ENUM ('NONE', 'PARTIAL', 'COMPLETE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "referralCode" TEXT NOT NULL,
    "referrerCode" TEXT,
    "nickname" TEXT,
    "avatar" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "WalletStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_relations" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "refereeId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "angel_nfts" (
    "id" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "type" "NFTType" NOT NULL DEFAULT 'ANGEL',
    "level" INTEGER NOT NULL,
    "power" INTEGER NOT NULL,
    "status" "NFTStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "angel_nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "star_nfts" (
    "id" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "type" "NFTType" NOT NULL DEFAULT 'STAR',
    "starLevel" INTEGER NOT NULL,
    "contractValue" DECIMAL(65,30) NOT NULL,
    "opsHolding" DECIMAL(65,30) NOT NULL,
    "opsRewards" DECIMAL(65,30) NOT NULL,
    "currentValue" DECIMAL(65,30) NOT NULL,
    "burnStatus" "BurnStatus" NOT NULL DEFAULT 'NONE',
    "releaseRate" DECIMAL(65,30) NOT NULL,
    "status" "NFTStatus" NOT NULL DEFAULT 'ACTIVE',
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "star_nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "star_nft_referrals" (
    "id" TEXT NOT NULL,
    "starNftId" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "refereeId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "rewardRate" DECIMAL(65,30) NOT NULL,
    "activatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "star_nft_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "star_nft_levels" (
    "id" INTEGER NOT NULL,
    "nameKey" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "returnRate" DECIMAL(65,30) NOT NULL,
    "opsHolding" DECIMAL(65,30) NOT NULL,
    "ownLevels" INTEGER NOT NULL,
    "benefitsKey" TEXT NOT NULL,

    CONSTRAINT "star_nft_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ops_presales" (
    "id" TEXT NOT NULL,
    "cycle" INTEGER NOT NULL,
    "stage" INTEGER NOT NULL,
    "currentPrice" DECIMAL(65,30) NOT NULL,
    "nextPrice" DECIMAL(65,30) NOT NULL,
    "soldAmount" DECIMAL(65,30) NOT NULL,
    "stageAmount" DECIMAL(65,30) NOT NULL,
    "totalStages" INTEGER NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ops_presales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_address_key" ON "wallets"("address");

-- CreateIndex
CREATE UNIQUE INDEX "angel_nfts_tokenId_key" ON "angel_nfts"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "star_nfts_tokenId_key" ON "star_nfts"("tokenId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_relations" ADD CONSTRAINT "referral_relations_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_relations" ADD CONSTRAINT "referral_relations_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "angel_nfts" ADD CONSTRAINT "angel_nfts_ownerAddress_fkey" FOREIGN KEY ("ownerAddress") REFERENCES "wallets"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star_nfts" ADD CONSTRAINT "star_nfts_ownerAddress_fkey" FOREIGN KEY ("ownerAddress") REFERENCES "wallets"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star_nft_referrals" ADD CONSTRAINT "star_nft_referrals_starNftId_fkey" FOREIGN KEY ("starNftId") REFERENCES "star_nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star_nft_referrals" ADD CONSTRAINT "star_nft_referrals_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star_nft_referrals" ADD CONSTRAINT "star_nft_referrals_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

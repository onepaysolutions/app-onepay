-- CreateEnum
CREATE TYPE "Zone" AS ENUM ('LEFT', 'MIDDLE', 'RIGHT');

-- AlterTable
ALTER TABLE "referral_relations" ADD COLUMN     "zone" "Zone" NOT NULL DEFAULT 'MIDDLE';

-- AlterTable
ALTER TABLE "star_nft_referrals" ADD COLUMN     "zone" "Zone" NOT NULL DEFAULT 'MIDDLE';

-- CreateTable
CREATE TABLE "zone_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "zone" "Zone" NOT NULL,
    "directCount" INTEGER NOT NULL DEFAULT 0,
    "teamCount" INTEGER NOT NULL DEFAULT 0,
    "directVolume" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "teamVolume" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zone_stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "zone_stats" ADD CONSTRAINT "zone_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

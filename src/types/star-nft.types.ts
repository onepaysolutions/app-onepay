import { NFTStatus } from './nfts';

export interface StarNFTConfig {
  id: number;
  name: string;
  nftPrice: number;
  usdcDistribution: {
    presale: number;
    reward: number;
    opsBuyback: number;
  };
  releaseValue: number;
  maxTiers: number;
  pairTiers: number;
}

export const STAR_NFT_CONFIGS: StarNFTConfig[] = [
  {
    id: 1,
    name: "Bronze Star",
    nftPrice: 500,
    usdcDistribution: {
      presale: 250,
      reward: 160,
      opsBuyback: 65
    },
    releaseValue: 1250,
    maxTiers: 3,
    pairTiers: 2
  },
  {
    id: 2,
    name: "Silver Star",
    nftPrice: 1000,
    usdcDistribution: {
      presale: 550,
      reward: 320,
      opsBuyback: 80
    },
    releaseValue: 2500,
    maxTiers: 4,
    pairTiers: 3
  },
  {
    id: 3,
    name: "Gold Star",
    nftPrice: 3000,
    usdcDistribution: {
      presale: 1800,
      reward: 960,
      opsBuyback: 90
    },
    releaseValue: 7500,
    maxTiers: 5,
    pairTiers: 4
  },
  {
    id: 4,
    name: "Diamond Star",
    nftPrice: 7000,
    usdcDistribution: {
      presale: 4550,
      reward: 2100,
      opsBuyback: 0
    },
    releaseValue: 17500,
    maxTiers: 6,
    pairTiers: 5
  }
];

export interface StarNFT {
  id: number;
  ownerAddress: string;
  level: number;
  status: NFTStatus;
  contractValue: number;
  createdAt: string;
  updatedAt: string
}

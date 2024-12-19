import { getContract, useContract } from '@thirdweb-dev/react';
import { StarNFTABI } from '../utils/abis/StarNFTABI';
import { AngelNFTABI } from '../utils/abis/AngelNFTABI';
import { USDTABI } from '../utils/abis/USDTABI';

// 合约地址配置
export const CONTRACT_ADDRESSES = {
  STAR_NFT: '0x31FF15aAA5CBD8Af46838c30dF141e20e1E244fe' as const,
  ANGEL_NFT: '0x620c741Ff92b992894Ab4b5d5a1Cc9F0bdDA5ce5' as const,
  ANGEL_NFT_ENGINE: '0x3Eb30D5c0a317567AfEc6b063A61B9ef25d8e8C2' as const,
  USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607' as const,
  OPE: '0x4200000000000000000000000000000000000042' as const,
  USER_NFT: '0x567F0669dC5280f1704485b1f8E9fd0C9056f3B3' as const,
  BACKEND_WALLET: '0x5cbB4786a824A5Bd54ecb8089c44102ac6f7A33A' as const
} as const;

// 定义合约地址类型
export type ContractAddresses = typeof CONTRACT_ADDRESSES;

// NFT 配置
export const NFT_CONFIG = {
  STAR: {
    address: CONTRACT_ADDRESSES.STAR_NFT,
    tokens: {
      STAR_1: { id: 0, price: 500 * 1e6, name: 'Star 1' },
      STAR_2: { id: 1, price: 1000 * 1e6, name: 'Star 2' },
      STAR_3: { id: 2, price: 3000 * 1e6, name: 'Star 3' },
      STAR_4: { id: 3, price: 7000 * 1e6, name: 'Star 4' }
    }
  },
  ANGEL: {
    address: CONTRACT_ADDRESSES.ANGEL_NFT,
    tokens: {
      ANGEL: { id: 0, price: 1000 * 1e6, name: 'Angel 1' },
    }
  },
  USDC: {
    address: CONTRACT_ADDRESSES.USDC,
    decimals: 6
  }
} as const;

// 获取合约实例
export function useStarNFTContract() {
  return useContract(CONTRACT_ADDRESSES.STAR_NFT, StarNFTABI);
}

export function useAngelNFTContract() {
  return useContract(CONTRACT_ADDRESSES.ANGEL_NFT, AngelNFTABI);
}

export function useUSDCContract() {
  return useContract(CONTRACT_ADDRESSES.USDC, USDTABI);
}

// Star NFT 工具函数
export function getStarNFTPrice(tokenId: number): number {
  const token = Object.values(NFT_CONFIG.STAR.tokens).find(t => t.id === tokenId);
  return token?.price || 0;
}

export function getStarNFTName(tokenId: number): string {
  const token = Object.values(NFT_CONFIG.STAR.tokens).find(t => t.id === tokenId);
  return token?.name || `Star ${tokenId + 1}`;
}

export function isValidStarNFTId(tokenId: number): boolean {
  return Object.values(NFT_CONFIG.STAR.tokens).some(t => t.id === tokenId);
}

export function getAllStarNFTs() {
  return Object.values(NFT_CONFIG.STAR.tokens);
}

// Angel NFT 工具函数
export function getAngelNFTPrice(tokenId: number): number {
  const token = Object.values(NFT_CONFIG.ANGEL.tokens).find(t => t.id === tokenId);
  return token?.price || 0;
}

export function getAngelNFTName(tokenId: number): string {
  const token = Object.values(NFT_CONFIG.ANGEL.tokens).find(t => t.id === tokenId);
  return token?.name || `Angel ${tokenId + 1}`;
}

export function isValidAngelNFTId(tokenId: number): boolean {
  return Object.values(NFT_CONFIG.ANGEL.tokens).some(t => t.id === tokenId);
}

export function getAllAngelNFTs() {
  return Object.values(NFT_CONFIG.ANGEL.tokens);
}

// 后端钱包工具函数
export function getBackendWalletAddress(): string {
  return CONTRACT_ADDRESSES.BACKEND_WALLET;
}

export function isBackendWallet(address: string): boolean {
  return address.toLowerCase() === CONTRACT_ADDRESSES.BACKEND_WALLET.toLowerCase();
}

// 类型定义
export interface NFTMetadata {
  id: number;
  price: number;
  name: string;
}

export interface ContractConfig {
  address: string;
  abi: any;
}

// 导出合约配置
export const CONTRACTS = {
  STAR_NFT: {
    address: CONTRACT_ADDRESSES.STAR_NFT,
    abi: StarNFTABI
  },
  ANGEL_NFT: {
    address: CONTRACT_ADDRESSES.ANGEL_NFT,
    abi: AngelNFTABI
  },
  ANGEL_NFT_ENGINE: {
    address: CONTRACT_ADDRESSES.ANGEL_NFT_ENGINE,
    abi: AngelNFTABI
  },
  USDC: {
    address: CONTRACT_ADDRESSES.USDC,
    abi: USDTABI
  }
} as const;

// 添加 NFT 价格常量
export const NFT_PRICES = {
  ANGEL: 1000 * 1e6, // 1000 USDT for all Angel NFTs
  STAR: {
    STAR_1: 500 * 1e6,
    STAR_2: 1000 * 1e6,
    STAR_3: 3000 * 1e6,
    STAR_4: 7000 * 1e6
  }
} as const; 
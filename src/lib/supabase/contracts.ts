import { Contract } from 'ethers'
import { supabase } from '@/lib/supabase'

// 基础 NFT 合约接口
export interface NFTContract extends Contract {
  mint: (to: string) => Promise<any>;
  balanceOf: (owner: string) => Promise<bigint>;
  ownerOf: (tokenId: number) => Promise<string>;
  tokenURI: (tokenId: number) => Promise<string>;
  approve: (to: string, tokenId: number) => Promise<any>;
  getApproved: (tokenId: number) => Promise<string>;
  setApprovalForAll: (operator: string, approved: boolean) => Promise<any>;
  isApprovedForAll: (owner: string, operator: string) => Promise<boolean>;
  transferFrom: (from: string, to: string, tokenId: number) => Promise<any>;
  safeTransferFrom: (from: string, to: string, tokenId: number) => Promise<any>;
}

// OPE Token 合约接口
export interface OPEContract extends Contract {
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  decimals: () => Promise<number>;
  totalSupply: () => Promise<bigint>;
  balanceOf: (account: string) => Promise<bigint>;
  transfer: (to: string, amount: bigint) => Promise<boolean>;
  allowance: (owner: string, spender: string) => Promise<bigint>;
  approve: (spender: string, amount: bigint) => Promise<boolean>;
  transferFrom: (from: string, to: string, amount: bigint) => Promise<boolean>;
  // OPE 特定方法
  mint: (to: string, amount: bigint) => Promise<boolean>;
  burn: (amount: bigint) => Promise<boolean>;
  pause: () => Promise<void>;
  unpause: () => Promise<void>;
  isPaused: () => Promise<boolean>;
  addToWhitelist: (account: string) => Promise<void>;
  removeFromWhitelist: (account: string) => Promise<void>;
  isWhitelisted: (account: string) => Promise<boolean>;
}

// Star NFT 合约接口
export interface StarNFTContract extends NFTContract {
  claim: () => Promise<any>;
  getStarLevel: (tokenId: number) => Promise<number>;
  setStarLevel: (tokenId: number, level: number) => Promise<any>;
  getClaimCooldown: (tokenId: number) => Promise<number>;
  getClaimAmount: (tokenId: number) => Promise<bigint>;
}

// Angel NFT 合约接口
export interface AngelNFTContract extends NFTContract {
  claim: () => Promise<any>;
  getAngelLevel: (tokenId: number) => Promise<number>;
  setAngelLevel: (tokenId: number, level: number) => Promise<any>;
  getClaimCooldown: (tokenId: number) => Promise<number>;
  getClaimAmount: (tokenId: number) => Promise<bigint>;
}

// 合约工厂函数
export const createContract = <T extends Contract>(
  address: string,
  abi: any,
  signer: any
): T => {
  return new Contract(address, abi, signer) as T;
}

// 获取 NFT 合约实例
export const getNFTContract = (
  address: string,
  abi: any,
  signer: any
): NFTContract => {
  return createContract<NFTContract>(address, abi, signer);
}

// 获取 OPE 合约实例
export const getOPEContract = (
  address: string,
  abi: any,
  signer: any
): OPEContract => {
  return createContract<OPEContract>(address, abi, signer);
}

// 获取 Star NFT 合约实例
export const getStarNFTContract = (
  address: string,
  abi: any,
  signer: any
): StarNFTContract => {
  return createContract<StarNFTContract>(address, abi, signer);
}

// 获取 Angel NFT 合约实例
export const getAngelNFTContract = (
  address: string,
  abi: any,
  signer: any
): AngelNFTContract => {
  return createContract<AngelNFTContract>(address, abi, signer);
} 
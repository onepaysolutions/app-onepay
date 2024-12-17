import { optimism } from "thirdweb/chains";
import { ContractAddresses } from "./config/contracts";

// 使用预定义的 optimism 链配置
export const chain = optimism;

// 合约地址配置
const contractAddresses: Record<number, ContractAddresses> = {
  10: {
    STAR_NFT: "0x31FF15aAA5CBD8Af46838c30dF141e20e1E244fe", // Optimism 上的 Star NFT 合约地址
    ANGEL_NFT: "0x620c741Ff92b992894Ab4b5d5a1Cc9F0bdDA5ce5", // Optimism 上的 Angel NFT 合约地址
    ANGEL_NFT_ENGINE: "0x3Eb30D5c0a317567AfEc6b063A61B9ef25d8e8C2", // Optimism 上的 Angel NFT Engine 合约地址
    USDC: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", // Optimism 上的 USDC 合约地址
    OPE: "0x4200000000000000000000000000000000000042", // Optimism 上的 OPE 合约地址
    BACKEND_WALLET: "0x5cbB4786a824A5Bd54ecb8089c44102ac6f7A33A", // Optimism 上的 Backend Wallet 合约地址
  },
};
  

// 获取特定链上的合约地址
export function getContractAddresses(chainId: number): ContractAddresses {
  const addresses = contractAddresses[chainId];
  if (!addresses) {
    throw new Error(`Chain ID ${chainId} not supported`);
  }
  return addresses;
}

// 检查链是否被支持
export function isSupportedChain(chainId: number): boolean {
  return Object.keys(contractAddresses).includes(chainId.toString());
}

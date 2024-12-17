import { getContract, useContract, useContractRead } from "thirdweb/react";
import { CONTRACT_ADDRESSES } from "@/lib/contracts/config";
import { StarNFTConfig, StarNFTClaim, NFTMetadata } from '@/types/database.types';
import { useContractRetry } from "@/hooks/useContractRetry";
import { toast } from "react-hot-toast";

export class StarNFTService {
  // 获取合约实例
  static async getStarNFTContract() {
    try {
      const contract = await getContract(CONTRACT_ADDRESSES.STARNFT);
      if (!contract) throw new Error("Contract not initialized");
      return contract;
    } catch (error) {
      console.error("Error getting StarNFT contract:", error);
      throw error;
    }
  }

  // Hook: 使用合约（带重试机制）
  static useStarNFTContractWithRetry(config = {}) {
    return useContractRetry(CONTRACT_ADDRESSES.STARNFT, config);
  }

  // Hook: 获取 NFT 余额
  static useStarNFTBalance(address: string | undefined) {
    const { contract } = useContract(CONTRACT_ADDRESSES.STARNFT);
    return useContractRead(contract, "balanceOf", [address]);
  }

  // Hook: 获取 NFT 元数据
  static useStarNFTMetadata(tokenId: number) {
    const { contract } = useContract(CONTRACT_ADDRESSES.STARNFT);
    return useContractRead(contract, "tokenURI", [tokenId]);
  }

  // 获取用户的所有 NFT 信息
  static async getStarNFTInfo(address: string): Promise<{ tokenId: number; metadata: NFTMetadata }[]> {
    try {
      const contract = await this.getStarNFTContract();
      
      // 获取余额
      const balance = await contract.erc721.balanceOf(address);
      if (balance.toNumber() === 0) return [];

      // 获取所有 token
      const tokens = [];
      for (let i = 0; i < balance.toNumber(); i++) {
        try {
          const tokenId = await contract.erc721.tokenOfOwnerByIndex(address, i);
          const uri = await contract.erc721.tokenURI(tokenId);
          
          // 获取元数据
          const response = await fetch(uri);
          const metadata: NFTMetadata = await response.json();
          
          tokens.push({ tokenId, metadata });
        } catch (error) {
          console.error(`Error fetching token ${i} for ${address}:`, error);
          continue; // 继续处理下一个 token
        }
      }

      return tokens;
    } catch (error) {
      console.error("Error fetching StarNFT info:", error);
      throw error;
    }
  }

  // Claim NFT
  static async claimUserNFT(quantity = 1) {
    try {
      const contract = await this.getStarNFTContract();
      
      // 检查是否可以 claim
      const canClaim = await contract.erc721.claimConditions.canClaim(quantity);
      if (!canClaim) {
        throw new Error("Cannot claim NFT at this time");
      }

      // 执行 claim
      const tx = await contract.erc721.claim(quantity);
      const receipt = await tx.wait();

      // 获取 claim 事件
      const event = receipt.events?.find(e => e.event === 'TokensClaimed');
      if (!event) throw new Error("Claim event not found");

      toast.success('NFT claimed successfully!');
      return {
        success: true,
        tokenId: event.args.tokenId,
        transactionHash: receipt.transactionHash
      };

    } catch (error) {
      console.error("Error claiming UserNFT:", error);
      toast.error(error instanceof Error ? error.message : 'Failed to claim NFT');
      throw error;
    }
  }

  // 获取 claim 条件
  static async getClaimConditions() {
    try {
      const contract = await this.getStarNFTContract();
      const conditions = await contract.erc721.claimConditions.getAll();
      return conditions;
    } catch (error) {
      console.error("Error getting claim conditions:", error);
      throw error;
    }
  }

  // 检查是否已经 claimed
  static async hasClaimedNFT(address: string): Promise<boolean> {
    try {
      const balance = await (await this.getStarNFTContract()).erc721.balanceOf(address);
      return balance.toNumber() > 0;
    } catch (error) {
      console.error("Error checking NFT claim status:", error);
      return false;
    }
  }

  // 获取 NFT 总供应量
  static async getTotalSupply(): Promise<number> {
    try {
      const contract = await this.getStarNFTContract();
      const supply = await contract.erc721.totalSupply();
      return supply.toNumber();
    } catch (error) {
      console.error("Error getting total supply:", error);
      throw error;
    }
  }

  // 监听 NFT 转移事件
  static async listenToTransferEvents(
    callback: (from: string, to: string, tokenId: number) => void
  ) {
    try {
      const contract = await this.getStarNFTContract();
      return contract.events.listen("Transfer", (event) => {
        const { from, to, tokenId } = event.data;
        callback(from, to, tokenId.toNumber());
      });
    } catch (error) {
      console.error("Error setting up transfer listener:", error);
      throw error;
    }
  }
} 
import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { StarNFTService } from '@/services/starNFTService';
import { CONTRACT_ADDRESSES } from "@/lib/contracts/config";

export function StarNFT() {
  const account = useActiveAccount();
  const { contract } = StarNFTService.useStarNFTContract();
  const { data: balance, isLoading: balanceLoading } = StarNFTService.useStarNFTBalance(account?.address);

  useEffect(() => {
    if (!contract || !account) return;

    const checkConnection = async () => {
      try {
        const isConnected = await contract.erc721.isApprovedForAll(
          account.address,
          CONTRACT_ADDRESSES.STARNFT
        );
        console.log('StarNFT contract connection:', isConnected);
      } catch (error) {
        console.error('Error checking StarNFT connection:', error);
      }
    };

    checkConnection();
  }, [contract, account]);

  // ... 其他渲染逻辑
} 
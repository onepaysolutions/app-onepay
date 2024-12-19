import { useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { Badge } from "@/components/ui/badge";
import { useActiveWallet } from "thirdweb/react";
import { CONTRACT_ADDRESSES } from "@/config/contracts";
import { ClaimButton2 } from "@/components/community/angel/ClaimButton2";

interface AngelNFTProps {
  address?: string;
}

export function AngelNFT({ address }: AngelNFTProps) {
  const walletAddress = useActiveWallet() as unknown as string;
  const { contract } = useContract(CONTRACT_ADDRESSES.ANGEL_NFT, "erc1155");
  const { data: nfts, isLoading } = useOwnedNFTs(contract, address || walletAddress);

  if (isLoading) {
    return (
      <div className="w-full h-48 rounded-lg animate-pulse bg-purple-900/20" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Angel NFT</h3>
        <Badge variant={nfts?.length ? "success" : "default"}>
          {nfts?.length || 0} NFTs
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts?.map((nft, index) => (
          <div
            key={index}
            className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20"
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img 
                src={nft.metadata.image || ''} 
                alt={`Angel NFT ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-medium mb-2">{nft.metadata.name || `Angel NFT #${index + 1}`}</h4>
            <p className="text-sm text-gray-400">{nft.metadata.description || 'No description available'}</p>
          </div>
        ))}
      </div>

      {!nfts?.length && walletAddress && (
        <div className="mt-6">
          <ClaimButton2 
            walletAddress={walletAddress}
            isDemoMode={false}
          />
        </div>
      )}
    </div>
  );
} 
import { useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { useActiveWallet } from "thirdweb/react";
import { CONTRACT_ADDRESSES } from "@/config/contracts";

interface StarNFTProps {
  address?: string;
}

export function StarNFT({ address }: StarNFTProps) {
  const walletAddress = useActiveWallet() as unknown as string;
  const { contract } = useContract(CONTRACT_ADDRESSES.STAR_NFT, "erc1155");
  const { data: nfts, isLoading } = useOwnedNFTs(contract, address || walletAddress);

  if (isLoading) {
    return (
      <div className="w-full h-[750px] rounded-lg animate-pulse bg-purple-900/20" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Star NFT</h3>
        <div className="text-sm text-gray-400">
          {nfts?.length || 0} NFTs Owned
        </div>
      </div>

      {/* NFT 展示区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts?.map((nft, index) => (
          <div
            key={index}
            className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20"
          >
            {/* NFT 内容 */}
          </div>
        ))}
      </div>
    </div>
  );
} 
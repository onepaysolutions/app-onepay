import { useContract, useOwnedNFTs, useAddress } from "@thirdweb-dev/react";
import { Badge } from "@/components/ui/badge";

const ANGEL_NFT_ADDRESS = "0x620c741Ff92b992894Ab4b5d5a1Cc9F0bdDA5ce5";

interface AngelNFTProps {
  address?: string;
}

export function AngelNFT({ address }: AngelNFTProps) {
  const walletAddress = useAddress();
  const { contract } = useContract(ANGEL_NFT_ADDRESS, "erc1155");
  const { data: nfts, isLoading } = useOwnedNFTs(contract, address || walletAddress);

  if (isLoading) {
    return (
      <div className="w-full h-[750px] rounded-lg animate-pulse bg-purple-900/20" />
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

      <iframe
        src={`https://embed.ipfscdn.io/ipfs/bafybeigdie2yyiazou7grjowoeoevmuip6akk33nqb55vrpezqdwfssrxyfy/erc1155.html?contract=${ANGEL_NFT_ADDRESS}&chain=%7B%22name%22%3A%22OP+Mainnet%22%2C%22chain%22%3A%22ETH%22%2C%22rpc%22%3A%5B%22https%3A%2F%2F10.rpc.thirdweb.com%2F%24%7BTHIRDWEB_API_KEY%7D%22%5D%2C%22nativeCurrency%22%3A%7B%22name%22%3A%22Ether%22%2C%22symbol%22%3A%22ETH%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22oeth%22%2C%22chainId%22%3A10%2C%22testnet%22%3Afalse%2C%22slug%22%3A%22optimism%22%2C%22icon%22%3A%7B%22url%22%3A%22ipfs%3A%2F%2FQmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9%2Foptimism%2F512.png%22%2C%22width%22%3A512%2C%22height%22%3A512%2C%22format%22%3A%22png%22%7D%7D&clientId=${THIRDWEB_CLIENT_ID}&tokenId=0&theme=dark&primaryColor=purple`}
        width="100%"
        height="750"
        className="rounded-lg border border-purple-500/20"
        style={{ maxWidth: '100%' }}
        frameBorder="0"
      />
    </div>
  );
} 
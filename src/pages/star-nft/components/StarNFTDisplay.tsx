interface StarNFTDisplayProps {
  level: number;
}

export function StarNFTDisplay({ level }: StarNFTDisplayProps) {
  return (
    <div className="aspect-square rounded-lg overflow-hidden bg-purple-900/20">
      <img 
        src={`/nfts/star-${level}.png`}
        alt={`Star NFT Level ${level}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
} 
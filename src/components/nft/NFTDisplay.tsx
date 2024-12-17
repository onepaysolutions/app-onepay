import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

interface NFTDisplayProps {
  type: 'angel' | 'star';
  address?: string;
}

export function NFTDisplay({ type, address }: NFTDisplayProps) {
  const { t } = useTranslation();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNFTs() {
      if (!address) return;

      try {
        const { data, error } = await supabase
          .from(type === 'angel' ? 'angel_nfts' : 'star_nfts')
          .select('*')
          .eq('walletaddress', address.toLowerCase());

        if (error) throw error;
        setNfts(data || []);
      } catch (error) {
        console.error(`Error fetching ${type} NFTs:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, [address, type]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!nfts.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t(`nft.${type}.noNFTs`)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <div 
          key={nft.id}
          className="bg-purple-800/20 rounded-lg p-4 border border-purple-500/20"
        >
          {/* NFT 展示卡片内容 */}
          <img 
            src={nft.image_url} 
            alt={nft.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h4 className="text-lg font-semibold">{nft.name}</h4>
          <p className="text-sm text-gray-400">{nft.description}</p>
        </div>
      ))}
    </div>
  );
} 
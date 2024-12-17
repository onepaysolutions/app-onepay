import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface NFTStats {
  totalMinted: number;
  totalSupply: number;
}

export function ClaimConditionsCard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<NFTStats>({
    totalMinted: 0,
    totalSupply: 300
  });

  useEffect(() => {
    async function fetchNFTStats() {
      try {
        // Get total minted from angel_nfts table
        const { count: mintedCount } = await supabase
          .from('angel_nfts')
          .select('token_id', { count: 'exact' });

        setStats(prev => ({
          ...prev,
          totalMinted: mintedCount || 0
        }));
      } catch (error) {
        console.error('Error fetching NFT stats:', error);
      }
    }

    fetchNFTStats();
  }, []);

  const remainingCount = stats.totalSupply - stats.totalMinted;

  return (
    <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
      <h3 className="text-lg font-semibold mb-3">
        {t('cards.claimConditions.title')}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t('cards.claimConditions.price')}:</span>
          <span className="font-medium text-purple-400">
            {t('cards.claimConditions.priceValue', { amount: '1000.0' })}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t('cards.claimConditions.totalSupply')}:</span>
          <span className="font-medium text-purple-400">{stats.totalSupply}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t('cards.claimConditions.claimed')}:</span>
          <span className="font-medium text-purple-400">{stats.totalMinted}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t('cards.claimConditions.available')}:</span>
          <span className="font-medium text-purple-400">{remainingCount}</span>
        </div>
      </div>
    </div>
  );
} 
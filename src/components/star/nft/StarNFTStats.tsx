import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface NFTStats {
  totalMinted: number;
  totalValueLocked: number;
  totalRewardsDistributed: number;
  averagePrice: number;
  error?: string;
}

const INITIAL_STATS: NFTStats = {
  totalMinted: 0,
  totalValueLocked: 0,
  totalRewardsDistributed: 0,
  averagePrice: 0
};

export function StarNFTStats() {
  const { t } = useTranslation('nft');
  const [stats, setStats] = useState<NFTStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('star_nfts')
          .select('contract_value, ops_rewards')
          .eq('status', 'ACTIVE');

        if (error) throw error;

        if (!data) {
          throw new Error('No data received from database');
        }

        const totalMinted = data.length;
        const totalValueLocked = data.reduce((sum, nft) => 
          sum + (Number(nft.contract_value) || 0), 0);
        const totalRewardsDistributed = data.reduce((sum, nft) => 
          sum + (Number(nft.ops_rewards) || 0), 0);
        const averagePrice = totalMinted > 0 ? totalValueLocked / totalMinted : 0;

        setStats({
          totalMinted,
          totalValueLocked,
          totalRewardsDistributed,
          averagePrice
        });
      } catch (error) {
        console.error('Error fetching NFT stats:', error);
        setStats(prev => ({
          ...prev,
          error: t('Error loading NFT stats')
        }));
        
        // 重试逻辑
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000 * (retryCount + 1)); // 递增重试延迟
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t, retryCount]);

  if (loading) {
    return (
      <div className="bg-purple-900/20 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-purple-700/20 rounded animate-pulse w-24" />
              <div className="h-8 bg-purple-700/20 rounded animate-pulse w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-900/20 rounded-xl p-6 text-center">
        <p className="text-red-400">{stats.error}</p>
        {retryCount < 3 && (
          <p className="text-sm text-gray-400 mt-2">
            {t('Retrying')}... ({retryCount + 1}/3)
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-purple-900/20 rounded-xl p-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/20 p-4 rounded">
          <p className="text-sm text-gray-400">{t('star.stats.holders')}</p>
          <p className="text-xl font-medium">{stats.totalMinted}</p>
        </div>
        <div className="bg-black/20 p-4 rounded">
          <p className="text-sm text-gray-400">{t('star.stats.volume')}</p>
          <p className="text-xl font-medium">
            ${stats.totalValueLocked.toLocaleString()}
          </p>
        </div>
        <div className="bg-black/20 p-4 rounded">
          <p className="text-sm text-gray-400">{t('star.stats.floor')}</p>
          <p className="text-xl font-medium">
            ${stats.averagePrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StarNFTStats; 
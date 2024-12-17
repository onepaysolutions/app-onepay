import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface ClaimProgressProps {
  totalSupply?: number;
}

export function ClaimProgress({ totalSupply = 300 }) {
  const { t } = useTranslation(['nft', 'common']);
  const [claimed, setClaimed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClaimProgress() {
      try {
        const { count } = await supabase
          .from('angel_nfts')
          .select('*', { count: 'exact' });
        
        setClaimed(count || 0);
      } catch (error) {
        console.error('Error fetching claim progress:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClaimProgress();
  }, []);

  const progress = (claimed / totalSupply) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-400">
          {t('claim.progress.claimed', { ns: 'nft' })}: {claimed}/{totalSupply}
        </span>
        <span className="text-purple-400 font-medium">
          {progress.toFixed(1)}%
        </span>
      </div>
      
      <div className="h-1.5 bg-[#1a1a1a]/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
        />
      </div>
      
      {isLoading && (
        <div className="text-xs text-gray-500 mt-1">
          {t('loading', { ns: 'common' })}...
        </div>
      )}
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface RewardsHistoryProps {
  address?: string;
  mockData?: RewardHistory[];
}

interface RewardHistory {
  id: string;
  type: 'DIRECT' | 'PAIR' | 'GLORY';
  amount: string;
  status: 'CLAIMED';
  created_at: string;
  claimed_at: string;
}

export function RewardsHistory({ address, mockData }: RewardsHistoryProps) {
  const { t } = useTranslation();
  const [history, setHistory] = useState<RewardHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mockData) {
      setHistory(mockData);
      setLoading(false);
      return;
    }
    async function fetchHistory() {
      if (!address) return;

      try {
        const { data, error } = await supabase
          .from('reward_transactions')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .eq('status', 'CLAIMED')
          .order('claimed_at', { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error('Error fetching reward history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [address, mockData]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-purple-900/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t('rewards.history.noHistory')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map(record => (
        <div 
          key={record.id}
          className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">{t(`rewards.types.${record.type.toLowerCase()}`)}</p>
              <p className="text-lg font-bold">
                {(Number(record.amount) / 10**18).toFixed(2)} OPE
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(record.claimed_at), { addSuffix: true })}
              </p>
              <p className="text-sm text-green-400">{t('rewards.status.claimed')}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 
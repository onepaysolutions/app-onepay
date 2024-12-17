import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';

interface NFTBenefit {
  level: number;
  directreward: string;
  pairreward: string;
  maxpairlevel: number;
}

export function StarNFTBenefits() {
  const { t } = useTranslation();
  const [benefits, setBenefits] = useState<NFTBenefit[]>([]);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const { data, error } = await supabase
          .from('starnftconfig')
          .select(`
            level,
            directreward,
            pairreward,
            maxpairlevel
          `)
          .order('level');

        if (error) throw error;
        setBenefits(data || []);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBenefits();
  }, []);

  return (
    <div className="card p-6">
      {benefits.map(benefit => (
        <div key={benefit.level}>
          <h3>Level {benefit.level}</h3>
          <p>{(Number(benefit.directreward) / 100).toFixed(1)}% {t('rewards.direct')}</p>
          <p>{benefit.maxpairlevel} {t('rewards.pairLevels')}</p>
        </div>
      ))}
    </div>
  );
} 
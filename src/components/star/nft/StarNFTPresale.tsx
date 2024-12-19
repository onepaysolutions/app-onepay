import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { OPSStageCard } from '../ops/OPSStageCard';
import { OPSAirdropInfo } from '../ops/OPSAirdropInfo';
import { AirdropCalculator } from '../ops/AirdropCalculator';

interface PresaleStage {
  cycle: number;
  stage: number;
  price: number;
  totalSupply: number;
  soldAmount: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed';
}

interface AirdropInfo {
  totalAmount: number;
  claimedAmount: number;
  remainingAmount: number;
  claimableAmount: number;
}

export function StarNFTPresale() {
  const { t } = useTranslation();
  const [presaleStages, setPresaleStages] = useState<PresaleStage[]>([]);
  const [airdropInfo, setAirdropInfo] = useState<AirdropInfo>({
    totalAmount: 1000000,
    claimedAmount: 0,
    remainingAmount: 1000000,
    claimableAmount: 0
  });
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPresaleData();
  }, []);

  const fetchPresaleData = async () => {
    try {
      setLoading(true);
      const { data: stagesData, error: stagesError } = await supabase
        .from('ops_presale_stages')
        .select('*')
        .order('cycle', { ascending: true })
        .order('stage', { ascending: true });

      if (stagesError) throw stagesError;

      const { data: airdropData, error: airdropError } = await supabase
        .from('ops_airdrops')
        .select('amount, claimed')
        .single();

      if (airdropError) throw airdropError;

      if (stagesData) {
        setPresaleStages(stagesData.map(stage => ({
          cycle: stage.cycle,
          stage: stage.stage,
          price: stage.price,
          totalSupply: stage.total_supply,
          soldAmount: stage.sold_amount,
          startTime: stage.start_time,
          endTime: stage.end_time,
          status: stage.status
        })));
      }

      if (airdropData) {
        setAirdropInfo({
          totalAmount: 1000000,
          claimedAmount: airdropData.claimed || 0,
          remainingAmount: 1000000 - (airdropData.claimed || 0),
          claimableAmount: airdropData.amount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching presale data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageSelect = (stageIndex: number) => {
    setSelectedStage(stageIndex);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-purple-900/20 rounded-xl animate-pulse" />
        <div className="h-40 bg-purple-900/20 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 预售阶段 */}
      <div>
        <h3 className="text-xl font-bold mb-4">{t('ops.presale.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presaleStages.map((stage, index) => (
            <OPSStageCard
              key={index}
              stage={stage.stage}
              price={stage.price}
              nextPrice={presaleStages[index + 1]?.price || stage.price * 1.1}
              soldAmount={stage.soldAmount}
              totalAmount={stage.totalSupply}
              startTime={stage.startTime}
              endTime={stage.endTime}
              onClick={() => handleStageSelect(index)}
            />
          ))}
        </div>
      </div>

      {/* 空投信息 */}
      <div>
        <h3 className="text-xl font-bold mb-4">{t('ops.airdrop.title')}</h3>
        <OPSAirdropInfo />
      </div>

      {/* 空投计算器 */}
      <div>
        <h3 className="text-xl font-bold mb-4">{t('ops.calculator.title')}</h3>
        <AirdropCalculator />
      </div>
    </div>
  );
} 
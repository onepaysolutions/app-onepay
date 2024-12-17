import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveAccount } from 'thirdweb/react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ClaimStarNFTButton } from './components/ClaimStarNFTButton';
import { StarNFTDisplay } from './components/StarNFTDisplay';
// Removed the import for StarNFTBenefits due to the error
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { StarNFTBenefits } from './components/StarNFTBenefits';

interface StageInfo {
  currentstage: number;
  totalminted: number;
  stagelimit: number;
  currentprice: string;
  nextprice: string;
}

interface NFTConfig {
  level: number;
  directreward: string;
  pairreward: string;
  maxpairlevel: number;
  contractvalue: string;
  releasethreshold: string;
}

export function StarNFT() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [stageInfo, setStageInfo] = useState<StageInfo | null>(null);
  const [nftConfig, setNftConfig] = useState<NFTConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 获取当前阶段信息
        const { data: stageData, error: stageError } = await supabase
          .from('currentstageview')
          .select('*')
          .single();

        if (stageError) throw stageError;

        // 获取 NFT 配置
        const { data: configData, error: configError } = await supabase
          .from('starnftconfig')
          .select('*')
          .order('level');

        if (configError) throw configError;

        setStageInfo(stageData);
        setNftConfig(configData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };

    if (account) {
      fetchData();
    }
  }, [account]);

  if (!account) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">{t('common.connectWallet')}</p>
      </div>
    );
  }

  const progress = stageInfo ? (stageInfo.totalminted / stageInfo.stagelimit) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* 头部信息 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t('starNFT.title')}</h1>
        <p className="text-gray-400">{t('starNFT.subtitle')}</p>
      </div>

      {/* NFT 展示 */}
      <div className="card p-6">
        <StarNFTDisplay level={nftConfig.length > 0 ? nftConfig[0].level : 0} />
      </div>

      {/* 进度和价格信息 */}
      <div className="card p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{t('starNFT.progress')}</span>
            <Badge variant="success">
              {stageInfo?.totalminted} / {stageInfo?.stagelimit}
            </Badge>
          </div>
          <Progress 
            value={progress} 
            max={100}
            color="purple"
            size="lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">{t('starNFT.currentPrice')}</p>
            <p className="text-xl font-bold">
              {stageInfo ? Number(stageInfo.currentprice) / 10**18 : 'N/A'} OPE
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">{t('starNFT.nextPrice')}</p>
            <p className="text-xl font-bold text-purple-400">
              {stageInfo ? Number(stageInfo.nextprice) / 10**18 : 'N/A'} OPE
            </p>
          </div>
        </div>

        <ClaimStarNFTButton 
          address={account.address || ''}
          price={stageInfo?.currentprice || ''}
        />
      </div>

      {/* NFT 权益说明 */}
      <StarNFTBenefits />
    </div>
  );
} 
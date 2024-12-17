import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContract } from '@thirdweb-dev/react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { Spinner } from '@/components/ui/spinner';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

interface ClaimStarNFTButtonProps {
  address: string;
  price: string;
}

interface StageInfo {
  currentStage: number;
  totalMinted: number;
  stageLimit: number;
  currentPrice: string;
  nextPrice: string;
}

export function ClaimStarNFTButton({ address, price }: ClaimStarNFTButtonProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { contract } = useContract(CONTRACT_ADDRESSES.STAR_NFT);

  const handleClaim = async () => {
    try {
      setIsLoading(true);

      // 1. 获取当前阶段信息
      const { data: stageInfo, error: stageError } = await supabase
        .from('nft_sale_stages')
        .select('*')
        .single();

      if (stageError) throw stageError;

      // 2. 检查是否超出阶段限制
      if (stageInfo.totalMinted >= stageInfo.stageLimit) {
        toast.error(t('starNFT.stageLimitReached'));
        return;
      }

      // 3. 调用合约进行购买
      const tx = await contract?.call(
        "claimStarNFT",
        [address],
        { value: price }
      );

      // 4. 等待交易确认
      await tx?.wait();

      // 5. 更新数据库
      const { error: updateError } = await supabase
        .from('starnftclaim')
        .insert({
          walletaddress: address.toLowerCase(),
          txHash: tx?.hash,
          stage: stageInfo.currentStage,
          price: price,
          status: 'PENDING'
        });

      if (updateError) throw updateError;

      // 6. 触发 webhook
      await fetch('/api/webhooks/nft-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address,
          txHash: tx?.hash,
          stage: stageInfo.currentStage,
          price
        })
      });

      // 7. 显示成功消息
      toast.success(t('starNFT.claimSuccess'));

      // 8. 添加通知
      await supabase
        .from('notifications')
        .insert({
          userId: address.toLowerCase(),
          type: 'NFT_CLAIM',
          title: t('notifications.nftClaim.title'),
          message: t('notifications.nftClaim.message', {
            stage: stageInfo.currentStage,
            price: Number(price) / 10**18
          }),
          data: {
            txHash: tx?.hash,
            stage: stageInfo.currentStage
          }
        });

    } catch (error) {
      console.error('Error claiming NFT:', error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={isLoading}
      className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 
        rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <Spinner size="sm" color="white" />
          <span>{t('common.processing')}</span>
        </>
      ) : (
        <span>{t('starNFT.claim')}</span>
      )}
    </button>
  );
} 
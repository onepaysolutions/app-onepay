import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCopy, FiShare2, FiUsers } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useDBConnection } from '@/hooks/useDBConnection';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { Spinner } from '@/components/ui/spinner';

interface ReferralLinkProps {
  address?: string;
}

// 模拟数据
const MOCK_DATA = {
  totalReferrals: 15,
  activeReferrals: 8,
  totalRewards: '5000000000000000000', // 5 OPE
  zoneStats: {
    left: { members: 5, volume: 1500 },
    middle: { members: 6, volume: 2000 },
    right: { members: 4, volume: 1500 }
  }
};

export default function ReferralLink({ address }: ReferralLinkProps) {
  const { t } = useTranslation();
  const isConnected = useDBConnection();
  const [selectedZone, setSelectedZone] = useState<'left' | 'middle' | 'right'>('middle');
  const [isCopying, setIsCopying] = useState(false);

  const referralLink = `${window.location.origin}?REF=${address}&ZONE=${selectedZone.toUpperCase()}`;

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(referralLink);
      toast.success(t('referral.link.copied'));
    } catch (error) {
      console.error('Failed to copy:', error);
    } finally {
      setIsCopying(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('app.title'),
          text: t('referral.link.shareText'),
          url: referralLink
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6">
      {/* 区域选择 */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {['left', 'middle', 'right'].map((zone) => (
            <Tooltip 
              key={zone}
              content={`${MOCK_DATA.zoneStats[zone as keyof typeof MOCK_DATA.zoneStats].members} members`}
              position="top"
            >
              <button
                onClick={() => setSelectedZone(zone as 'left' | 'middle' | 'right')}
                className={`
                  relative py-3 px-4 rounded-lg font-medium transition-all duration-300
                  ${selectedZone === zone
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'bg-purple-900/20 text-gray-300 hover:bg-purple-900/40'
                  }
                `}
              >
                <span className="relative z-10">{t(`referral.zones.${zone}`)}</span>
                <Progress
                  value={MOCK_DATA.zoneStats[zone as keyof typeof MOCK_DATA.zoneStats].volume}
                  max={3000}
                  size="sm"
                />
              </button>
            </Tooltip>
          ))}
        </div>

        {/* 区域统计 */}
        <div className="flex items-center justify-between px-4 py-3 bg-purple-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">{t('referral.stats.active')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              {MOCK_DATA.activeReferrals}
            </Badge>
            <span className="text-sm text-gray-400">/</span>
            <Badge variant="default" size="sm">
              {MOCK_DATA.totalReferrals}
            </Badge>
          </div>
        </div>
      </div>

      {/* 链接显示和复制 */}
      <div className="flex gap-2">
        <label htmlFor="referralLink" className="sr-only">Referral Link</label>
        <input
          id="referralLink"
          type="text"
          value={referralLink}
          readOnly
          placeholder="Referral Link"
          className="flex-1 bg-purple-900/20 rounded-lg px-4 py-2 text-sm"
        />
        <Tooltip content={t('referral.link.copy')} position="top">
          <button
            onClick={handleCopy}
            disabled={isCopying}
            className="p-2 bg-purple-900/20 rounded-lg hover:bg-purple-900/40 transition-colors disabled:opacity-50"
          >
            {isCopying ? <Spinner size="sm" /> : <FiCopy className="w-5 h-5" />}
          </button>
        </Tooltip>
        <Tooltip content={t('referral.link.share')} position="top">
          <button
            onClick={handleShare}
            className="p-2 bg-purple-900/20 rounded-lg hover:bg-purple-900/40 transition-colors"
            title={t('referral.link.share')}
          >
            <FiShare2 className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>

      {/* 模拟数据提示 */}
      {!isConnected && (
        <Badge variant="warning" glow>
          {t('common.demoMode')}
        </Badge>
      )}
    </div>
  );
} 
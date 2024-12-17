import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { NFTBadge } from './NFTBadge';

interface NFTData {
  tokenId: number;
  starLevel: number;
  contractValue: string;
  opsHolding: string;
  opsRewards: string;
  currentValue: string;
  releaseRate: string;
}

interface StarNFTCardProps {
  nft: NFTData;
}

export function StarNFTCard({ nft }: StarNFTCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-lg p-4 backdrop-blur-sm border border-purple-500/20"
    >
      {/* NFT 头部信息 - 更紧凑的布局 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10">
          <NFTBadge level={nft.starLevel} size={40} />
        </div>
        <div>
          <h3 className="text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t(`starNFT.levels.vip${nft.starLevel}.title`)}
          </h3>
          <p className="text-sm text-gray-400">
            Token #{nft.tokenId}
          </p>
        </div>
      </div>

      {/* NFT 数据 - 更紧凑的网格布局 */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-black/30 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">{t("Contract Value")}</p>
          <p className="font-medium">
            ${Number(nft.contractValue).toLocaleString()}
          </p>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">{t("Current Value")}</p>
          <p className="font-medium">
            ${Number(nft.currentValue).toLocaleString()}
          </p>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">{t("OPS Holding")}</p>
          <p className="font-medium">
            {Number(nft.opsHolding).toLocaleString()} OPS
          </p>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">{t("OPS Rewards")}</p>
          <p className="font-medium">
            {Number(nft.opsRewards).toLocaleString()} OPS
          </p>
        </div>
      </div>

      {/* Release Rate - 底部操作栏 */}
      <div className="mt-3 bg-black/30 rounded-lg p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 mb-1">{t("Release Rate")}</p>
          <p className="font-medium">
            {Number(nft.releaseRate)}%
          </p>
        </div>
        <button
          onClick={() => {
            // TODO: 实现释放功能
            console.log('Release NFT:', nft.tokenId);
          }}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-xs font-medium transition-colors"
        >
          {t("Release")}
        </button>
      </div>
    </motion.div>
  );
}

export default StarNFTCard; 
import { useTranslation } from "react-i18next";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import nftPreview from '@/assets/images/nft.png';
import { useEffect, useState } from "react";

interface ShareReferralLinkProps {
  address: string;
}

export const ShareReferralLink: React.FC<ShareReferralLinkProps> = ({ address }) => {
  const { t } = useTranslation();
  const [referralUrl, setReferralUrl] = useState<string>("");

  useEffect(() => {
    if (address) {
      // 确保 address 是字符串
      const addressStr = typeof address === 'string' ? address : String(address);
      setReferralUrl(`${window.location.origin}?REF=${addressStr}`);
      console.log("Setting referral URL:", addressStr);
    }
  }, [address]);

  // 如果没有地址，不显示组件
  if (!address) {
    console.log("No address found in ShareReferralLink");
    return null;
  }

  const handleShare = async () => {
    try {
      // 创建要分享的文件
      const response = await fetch(nftPreview);
      const blob = await response.blob();
      const file = new File([blob], 'nft-preview.png', { type: 'image/png' });

      const shareText = t("Check out this NFT claim opportunity! Get 180 OPS tokens as reward. Use my referral link:");
      const shareTitle = t("Star NFT");

      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: referralUrl,
          files: [file]
        });
      } else {
        // 如果不支持 Web Share API，则复制链接
        await navigator.clipboard.writeText(
          `${shareTitle}\n${shareText}\n${referralUrl}`
        );
        toast.success(t("Copied!"));
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // 失败时也复制链接
      await navigator.clipboard.writeText(referralUrl);
      toast.success(t("Copied!"));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      toast.success(t("Copied!"));
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
      <div className="bg-gradient-to-r from-purple-900/40 to-black/40 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20 shadow-lg shadow-purple-500/20">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold">{t("Your Referral Link")}</h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-purple-900/50 hover:bg-purple-900/70 transition-colors"
              title={t("Copy link")}
            >
              <IoCopyOutline className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-purple-900/50 hover:bg-purple-900/70 transition-colors"
              title={t("Share link")}
            >
              <IoShareSocialOutline className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-3 text-sm break-all">
          {referralUrl}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          {t("Share this link to earn rewards for each successful referral")}
        </div>
      </div>
    </div>
  );
}

export default ShareReferralLink;

// ... 代码保持不变 
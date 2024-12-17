import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import { FaTwitter, FaTelegram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { ZoneType } from '@/types/rewards';

interface BottomReferralLinkProps {
  referralCode: string;
  onZoneSelect?: (zone: ZoneType) => void;
}

export function BottomReferralLink({ referralCode, onZoneSelect }: BottomReferralLinkProps) {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState<ZoneType | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const referralLink = `${window.location.origin}/register?ref=${referralCode}${selectedZone ? `&zone=${selectedZone}` : ''}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      // 可以添加复制成功的提示
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleZoneSelect = (zone: ZoneType) => {
    setSelectedZone(zone);
    onZoneSelect?.(zone);
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on OPE! ${referralLink}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me on OPE!')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Join me on OPE! ${referralLink}`)}`
  };

  return (
    <div className="referral-container">
      {/* 区域选择 */}
      <div className="zone-selector">
        <p className="zone-title">{t("Select Placement Zone")}</p>
        <div className="zone-buttons">
          {(['LEFT', 'MIDDLE', 'RIGHT'] as ZoneType[]).map((zone) => (
            <button
              key={zone}
              className={`${
                selectedZone === zone ? 'zone-active' : ''
              }`}
              onClick={() => handleZoneSelect(zone)}
            >
              <div className="zone-icon">
                {/* 可以为每个区域添加特定图标 */}
                {zone === 'LEFT' && '←'}
                {zone === 'MIDDLE' && '↑'}
                {zone === 'RIGHT' && '→'}
              </div>
              <span>{t(zone)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 推荐链接 */}
      <div className="link-container">
        <label htmlFor="referralLinkInput" className="link-label">推荐链接</label>
        <input
          id="referralLinkInput"
          type="text"
          value={referralLink}
          readOnly
          className="link-input"
        />
        <div className="actions">
          <button
            onClick={handleCopy}
            className="action-button"
            title={t("Copy Link")}
          >
            <FiCopy />
          </button>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="action-button"
            title={t("Share")}
          >
            <FiShare2 />
          </button>
        </div>
      </div>

      {/* 社交分享菜单 */}
      {showShareMenu && (
        <div className="share-menu">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button"
          >
            <FaTwitter className="text-[#1DA1F2]" />
            <span>Twitter</span>
          </a>
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button"
          >
            <FaTelegram className="text-[#0088cc]" />
            <span>Telegram</span>
          </a>
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button"
          >
            <FaFacebook className="text-[#4267B2]" />
            <span>Facebook</span>
          </a>
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button"
          >
            <FaWhatsapp className="text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
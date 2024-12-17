import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { IoShareSocialOutline, IoCloseOutline } from 'react-icons/io5';
import { FaFacebook, FaWhatsapp, FaTelegram, FaTwitter } from 'react-icons/fa';
import styles from './ReferralLink.module.css';

interface ReferralLinkProps {
  address: string;
}

export function ReferralLink({ address }: ReferralLinkProps) {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const zones = [
    { value: 'left', label: t('referral.zones.left') },
    { value: 'middle', label: t('referral.zones.middle') },
    { value: 'right', label: t('referral.zones.right') }
  ];

  const getReferralLink = useCallback(() => {
    if (!selectedZone) return '';
    return `${window.location.origin}?REF=${address}&ZONE=${selectedZone}`;
  }, [address, selectedZone]);

  const handleCopy = useCallback(async () => {
    if (!selectedZone) return;
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [selectedZone, getReferralLink]);

  const handleShare = (platform: string) => {
    if (!selectedZone) return;
    const link = getReferralLink();
    const text = t('referral.link.shareText');
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + link)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=575,height=400,menubar=0');
    }
  };

  return (
    <div className={styles.container}>
      {/* 浮动按钮 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`${styles.floatingButton} ${
          isVisible ? styles.buttonActive : styles.buttonInactive
        }`}
      >
        {isVisible ? (
          <IoCloseOutline className="w-6 h-6" />
        ) : (
          <>
            <IoShareSocialOutline className="w-6 h-6" />
            <span className="ml-2">{t('referral.share.button')}</span>
            <div className={styles.notification} />
          </>
        )}
      </button>

      {/* 弹出面板 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={styles.panel}
          >
            <div className={styles.panelContent}>
              {/* 区域选择 */}
              <div className={styles.zoneSelector}>
                {zones.map(zone => (
                  <button
                    key={zone.value}
                    onClick={() => setSelectedZone(zone.value)}
                    className={`${styles.zoneButton} ${
                      selectedZone === zone.value ? styles.zoneButtonActive : ''
                    }`}
                  >
                    {zone.label}
                  </button>
                ))}
              </div>

              {/* 链接和复制按钮 */}
              <div className={styles.linkSection}>
                <input
                  type="text"
                  value={getReferralLink()}
                  readOnly
                  disabled={!selectedZone}
                  placeholder={t('referral.link.selectZone')}
                  className={styles.linkInput}
                />
                <button
                  onClick={handleCopy}
                  disabled={!selectedZone}
                  className={styles.copyButton}
                >
                  {copied ? t('referral.link.copied') : t('referral.link.copy')}
                </button>
              </div>

              {/* 社交分享 */}
              <div className={styles.socialShare}>
                <button
                  onClick={() => handleShare('facebook')}
                  className={styles.socialButton}
                  disabled={!selectedZone}
                >
                  <FaFacebook size={24} />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className={styles.socialButton}
                  disabled={!selectedZone}
                >
                  <FaTwitter size={24} />
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className={styles.socialButton}
                  disabled={!selectedZone}
                >
                  <FaTelegram size={24} />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className={styles.socialButton}
                  disabled={!selectedZone}
                >
                  <FaWhatsapp size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
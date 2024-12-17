import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaWhatsapp, FaTelegram, FaTwitter } from 'react-icons/fa';
import { IoShareSocialOutline, IoCloseOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralLinkProps {
  address: string;
}

export function ReferralLink({ address }: ReferralLinkProps) {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const zones = [
    { value: 'left', label: t('share.zones.left') },
    { value: 'middle', label: t('share.zones.middle') },
    { value: 'right', label: t('share.zones.right') }
  ];
  
  const getReferralLink = () => {
    if (!selectedZone) return '';
    return `${window.location.origin}?REF=${address}&ZONE=${selectedZone}`;
  };

  const handleCopy = async () => {
    if (!selectedZone) return;
    
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    if (!selectedZone) return;
    
    const link = getReferralLink();
    const text = t('referral.link.shareText');
    
    let shareUrl = '';
    
    try {
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
        default:
          return;
      }

      const width = 575;
      const height = 400;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      const opts = `status=1,width=${width},height=${height},top=${top},left=${left}`;
      
      window.open(shareUrl, 'share', opts);
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  return (
    <div className="sticky bottom-[64px] z-50 w-full">
      <div className="relative w-full max-w-7xl mx-auto px-4">
        {/* 浮动按钮 */}
        <div className="absolute right-4 md:right-8">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className={`
              group flex items-center gap-2 px-4 py-3 rounded-full font-medium shadow-lg transition-all duration-300
              ${isVisible 
                ? 'bg-red-500 hover:bg-red-600 pr-3' 
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600'
              }
              hover:shadow-xl hover:scale-105 animate-bounce-gentle border-2 border-white/10 text-base
            `}
          >
            {isVisible ? (
              <IoCloseOutline className="w-6 h-6 text-white" />
            ) : (
              <>
                <IoShareSocialOutline className="w-6 h-6 text-white" />
                <span className="text-white font-medium whitespace-nowrap">
                  {t('share.button')}
                </span>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full" />
              </>
            )}
          </button>
        </div>

        {/* 推荐链接面板 */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="absolute top-[40px] right-4 w-full max-w-[360px] md:right-8"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl border-2 border-white/20">
                <div className="flex flex-col gap-4">
                  {/* 区域选择 */}
                  <div className="grid grid-cols-3 gap-3">
                    {zones.map((zone) => (
                      <button
                        key={zone.value}
                        onClick={() => setSelectedZone(zone.value)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200
                          ${selectedZone === zone.value
                            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                          }`}
                      >
                        {zone.label}
                      </button>
                    ))}
                  </div>

                  {/* 推荐链接和复制按钮 */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={getReferralLink()}
                      readOnly
                      disabled={!selectedZone}
                      placeholder={t('share.selectZone')}
                      className="flex-1 min-w-0 bg-white/5 rounded-lg px-4 py-3 border border-white/10 text-white placeholder-gray-400 text-sm"
                    />
                    <button
                      onClick={handleCopy}
                      disabled={!selectedZone}
                      className={`shrink-0 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                        ${selectedZone
                          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      {copied ? t('referral.link.copied') : t('referral.link.copy')}
                    </button>
                  </div>

                  {/* 社交分享图标 */}
                  <div className="flex gap-6 justify-center items-center pt-2">
                    <button
                      onClick={() => handleShare('facebook')}
                      disabled={!selectedZone}
                      className={`p-3 rounded-full transition-all duration-200 hover:bg-white/10
                        ${selectedZone ? 'text-blue-400 hover:text-blue-300' : 'text-gray-600 cursor-not-allowed'}`}
                      title={t('share.social.facebook')}
                    >
                      <FaFacebook size={28} />
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      disabled={!selectedZone}
                      className={`p-3 rounded-full transition-all duration-200 hover:bg-white/10
                        ${selectedZone ? 'text-green-400 hover:text-green-300' : 'text-gray-600 cursor-not-allowed'}`}
                      title={t('share.social.whatsapp')}
                    >
                      <FaWhatsapp size={28} />
                    </button>
                    <button
                      onClick={() => handleShare('telegram')}
                      disabled={!selectedZone}
                      className={`p-3 rounded-full transition-all duration-200 hover:bg-white/10
                        ${selectedZone ? 'text-blue-400 hover:text-blue-300' : 'text-gray-600 cursor-not-allowed'}`}
                      title={t('share.social.telegram')}
                    >
                      <FaTelegram size={28} />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      disabled={!selectedZone}
                      className={`p-3 rounded-full transition-all duration-200 hover:bg-white/10
                        ${selectedZone ? 'text-sky-400 hover:text-sky-300' : 'text-gray-600 cursor-not-allowed'}`}
                      title={t('share.social.twitter')}
                    >
                      <FaTwitter size={28} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaFacebook, FaWhatsapp, FaTelegram, FaTwitter } from 'react-icons/fa';

interface UnifiedReferralLinkProps {
  address: string;
  variant?: 'bottom' | 'full' | 'simple';
}

export function UnifiedReferralLink({ address, variant = 'full' }: UnifiedReferralLinkProps) {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState<string>('middle');
  const [copied, setCopied] = useState(false);

  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      ref: address.toLowerCase(),
      zone: selectedZone
    });
    return `${baseUrl}/referral?${params.toString()}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleShare = (platform: string) => {
    const link = getReferralLink();
    const text = 'Join OnePay Community';
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
      window.open(shareUrl, '_blank', 'width=575,height=400');
    }
  };

  // Bottom compact version
  if (variant === 'bottom') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-20 left-0 right-0 px-4 pb-4"
      >
        <div className="max-w-lg mx-auto bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="flex-1 truncate text-sm text-gray-300">
              {getReferralLink()}
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Full version
  return (
    <div className="bg-purple-900/30 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-purple-500/20">
      <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
      
      {variant === 'full' && (
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
          {[
            { key: 'left', label: 'Left Zone' },
            { key: 'middle', label: 'Middle Zone' },
            { key: 'right', label: 'Right Zone' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedZone(key)}
              className={`p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium transition-all
                ${selectedZone === key 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
        <input
          type="text"
          readOnly
          value={getReferralLink()}
          className="w-full md:flex-1 bg-black/20 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm"
          title="Referral Link"
          placeholder="Referral Link"
        />
        <button
          onClick={handleCopy}
          className="w-full md:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs md:text-sm transition-colors whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {variant === 'full' && (
        <div className="flex justify-center gap-4 md:gap-6">
          <button onClick={() => handleShare('facebook')} className="text-blue-400 hover:text-blue-300" title="Share on Facebook">
            <FaFacebook className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button onClick={() => handleShare('twitter')} className="text-sky-400 hover:text-sky-300" title="Share on Twitter">
            <FaTwitter className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button onClick={() => handleShare('telegram')} className="text-blue-400 hover:text-blue-300" title="Share on Telegram">
            <FaTelegram className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button onClick={() => handleShare('whatsapp')} className="text-green-400 hover:text-green-300" title="Share on WhatsApp">
            <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      )}
    </div>
  );
} 
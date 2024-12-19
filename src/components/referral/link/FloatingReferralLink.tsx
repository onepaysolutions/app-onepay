import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { IoShareSocialOutline, IoCloseOutline } from 'react-icons/io5';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface FloatingReferralLinkProps {
  address: string;
}

export function FloatingReferralLink({ address }: FloatingReferralLinkProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('');

  const zones = [
    { value: 'left', label: '左区' },
    { value: 'middle', label: '中区' },
    { value: 'right', label: '右区' }
  ];

  const getReferralLink = () => {
    if (!selectedZone) return '';
    return `${window.location.origin}?REF=${address}&ZONE=${selectedZone}`;
  };

  const handleCopy = async () => {
    if (!selectedZone) {
      toast.error('choose zone');
      return;
    }
    try {
      await navigator.clipboard.writeText(getReferralLink());
      toast.success('copy success');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('copy failed');
    }
  };

  return (
    <>
      {/* 浮动按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <IoCloseOutline className="w-5 h-5" />
        ) : (
          <>
            <IoShareSocialOutline className="w-5 h-5" />
            <span className="text-sm">share</span>
          </>
        )}
      </motion.button>

      {/* 弹出面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-40 right-4 z-50 w-80 bg-gradient-to-b from-purple-900/90 to-black/90 rounded-xl backdrop-blur-sm border border-purple-500/20 shadow-xl p-4"
          >
            {/* 区域选择 */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">选择推荐区域</p>
              <div className="grid grid-cols-3 gap-2">
                {zones.map(zone => (
                  <button
                    key={zone.value}
                    onClick={() => setSelectedZone(zone.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedZone === zone.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-900/50 text-gray-300 hover:bg-purple-900/70'
                    }`}
                  >
                    {zone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 链接显示和复制 */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={getReferralLink()}
                placeholder="choose zone"  
                className="flex-1 px-3 py-2 bg-black/30 rounded-lg text-sm border border-purple-500/20"
              />
              <button
                onClick={handleCopy}
                title="copy"
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <FiCopy className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCopy } from 'react-icons/io5';

interface ContractAddressProps {
  address: string;
}

export function ContractAddress({ address }: ContractAddressProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <div className="font-mono text-sm text-gray-400 truncate">
        {address}
      </div>
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 
            text-purple-400 transition-colors"
        >
          <IoCopy className="w-4 h-4" />
        </motion.button>
        
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 px-2 py-1 
                bg-purple-600 text-white text-xs rounded-lg whitespace-nowrap"
            >
              {t('community.addressCopied')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
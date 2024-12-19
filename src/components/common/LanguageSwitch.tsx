import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiCheck } from 'react-icons/fi';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ms', name: 'Bahasa Melayu' }
];

export function LanguageSwitch() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="切换语言"
        className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 
                   transition-colors duration-200 text-purple-400"
      >
        <FiGlobe className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-40 py-2 
                     bg-black/90 backdrop-blur-xl rounded-xl 
                     border border-purple-500/20 shadow-xl"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="flex items-center justify-between w-full px-4 py-2 
                         text-sm text-gray-300 hover:text-white 
                         hover:bg-purple-500/20 transition-colors"
              >
                {lang.name}
                {i18n.language === lang.code && (
                  <FiCheck className="w-4 h-4 text-purple-400" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
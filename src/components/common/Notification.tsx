import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  isOpen: boolean;
}

export function Notification({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  isOpen
}: NotificationProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/40';
      case 'error':
        return 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/40';
      default:
        return 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/40';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${getTypeStyles()} backdrop-blur-md`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-gray-300">{message}</p>
            </div>
            <button
              aria-label={t('notification.close')}
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
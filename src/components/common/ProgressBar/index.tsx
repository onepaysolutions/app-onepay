import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

interface ProgressBarProps {
  current: number;
  total: number;
  isLoading?: boolean;
  className?: string;
}

export function ProgressBar({ current, total, isLoading, className = '' }: ProgressBarProps) {
  const { t } = useTranslation(['nft', 'common']);
  const progress = (current / total) * 100;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <span className={styles.stats}>
          {t('claim.progress.claimed', { ns: 'nft' })}: {current}/{total}
        </span>
        <span className={styles.percentage}>
          {progress.toFixed(1)}%
        </span>
      </div>
      
      <div className={styles.track}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={styles.bar}
        />
      </div>
      
      {isLoading && (
        <div className={styles.loading}>
          {t('loading', { ns: 'common' })}...
        </div>
      )}
    </div>
  );
} 
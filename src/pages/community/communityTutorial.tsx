"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ClaimButton } from '@/components/community/angel/ClaimButton';
import { DemoModeToggle } from '@/components/community/demo/DemoModeToggle';
import styles from '@/styles/community.module.css';
import { FaShieldAlt, FaGift, FaUsers } from 'react-icons/fa';

const benefits = [
  {
    icon: <FaShieldAlt className="text-xl text-purple-400" />,
    key: 'exclusive',
  },
  {
    icon: <FaGift className="text-xl text-purple-400" />,
    key: 'token',
  },
  {
    icon: <FaUsers className="text-xl text-purple-400" />,
    key: 'features',
  },
  {
    icon: <FaUsers className="text-xl text-purple-400" />,
    key: 'voting',
  }
];

export default function Community() {
  const { t } = useTranslation(['community', 'translation']);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={`${styles.card} ${isDemoMode ? styles.demoMode : ''}`}>
          {isDemoMode && (
            <div className={styles.demoLabel}>
              {t('tutorial.demo.mode', { ns: 'translation' })}
            </div>
          )}
          
          <div className={styles.cardInner}>
            <div 
              className={styles.cardBackground}
              style={{ backgroundImage: 'url(/images/community-bg.jpg)' }}
            />
            
            <div className={styles.cardContent}>
              <h1 className={styles.title}>
                {t('title', { ns: 'community' })}
              </h1>
              <p className={styles.subtitle}>
                {t('subtitle', { ns: 'community' })}
              </p>

              <div className={styles.benefitsList}>
                {benefits.map(({ icon, key }) => (
                  <div key={key} className={styles.benefitItem}>
                    <div className={styles.benefitIcon}>
                      {icon}
                    </div>
                    <div className={styles.benefitText}>
                      <div className="font-medium">
                        {t(`benefits.${key}.title`, { ns: 'community' })}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {t(`benefits.${key}.description`, { ns: 'community' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <ClaimButton
                walletAddress="0x"
                tokenId={0n}
                isDemoMode={isDemoMode}
              />

              <button 
                className={styles.learnMoreButton}
                onClick={() => window.open('/docs/ope-token', '_blank')}
              >
                <span>{t('buttons.learnOPE', { ns: 'community' })}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DemoModeToggle 
        isDemoMode={isDemoMode}
        onToggle={toggleDemoMode}
      />
    </div>
  );
}
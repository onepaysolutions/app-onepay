import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OPSSale.module.css';
import { supabase } from '../../lib/supabase';

interface StageInfo {
  currentstage: number;
  totalminted: number;
  stagelimit: number;
  currentprice: string;
  nextprice: string;
  progress: number;
}

export function OPSSale() {
  const { t } = useTranslation();
  const [stageInfo, setStageInfo] = useState<StageInfo | null>(null);

  useEffect(() => {
    const fetchStageInfo = async () => {
      const { data, error } = await supabase
        .from('currentstageview')
        .select('*')
        .single();

      if (!error && data) {
        setStageInfo(data);
      }
    };

    fetchStageInfo();
  }, []);

  if (!stageInfo) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Stage {stageInfo.currentstage}</h2>
        <div className={styles.progress}>
          {stageInfo.progress.toFixed(2)}%
        </div>
      </div>
      
      <div className={styles.prices}>
        <div>
          <p>Current Price</p>
          <p>${Number(stageInfo.currentprice) / 10**18}</p>
        </div>
        <div>
          <p>Next Price</p>
          <p>${Number(stageInfo.nextprice) / 10**18}</p>
        </div>
      </div>
    </div>
  );
} 
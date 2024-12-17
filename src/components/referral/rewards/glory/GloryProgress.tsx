import styles from "./GloryRewards.module.css";

interface GloryProgressProps {
  current: number;
  target: number;
  color: string;
}

export function GloryProgress({ current, target, color }: GloryProgressProps) {
  // 计算进度百分比，最大100%
  const percentage = Math.min((current / target) * 100, 100);
  
  // 移除 text- 前缀，添加 bg- 前缀
  const bgColor = color.replace('text-', 'bg-');

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div 
          className={`${styles.progressFill} ${bgColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={styles.progressText}>
        <span>{(current / 10**18).toFixed(2)} / {(target / 10**18).toFixed(2)} USDC</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
} 
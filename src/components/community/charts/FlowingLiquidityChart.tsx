import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './FlowingLiquidityChart.css';

interface FlowingLiquidityChartProps {
  totalUSDT: number;
}

export function FlowingLiquidityChart({ totalUSDT }: FlowingLiquidityChartProps) {
  const { t } = useTranslation();
  const [displayedUSDT, setDisplayedUSDT] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const startValue = displayedUSDT;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (totalUSDT - startValue) * easeOutProgress;
      setDisplayedUSDT(Math.round(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [totalUSDT]);

  return (
    <div className="liquidity-chart-container relative w-full aspect-[2/1]">
      <svg
        viewBox="0 0 400 200"
        className="w-full h-full glow-effect"
        preserveAspectRatio="none"
      >
        <defs>
          {/* 主要液体渐变 */}
          <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
          </linearGradient>

          {/* 波浪效果 - 前层 */}
          <pattern id="waveFront" x="0" y="0" width="140" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M -40 20 Q -20 40, 0 20 Q 20 0, 40 20 Q 60 40, 80 20 Q 100 0, 120 20 Q 140 40, 160 20 Q 180 0, 200 20"
              fill="none"
              stroke="url(#liquidGradient)"
              strokeWidth="3"
            />
          </pattern>

          {/* 波浪效果 - 中层 */}
          <pattern id="waveMiddle" x="0" y="0" width="180" height="35" patternUnits="userSpaceOnUse">
            <path
              d="M -60 17.5 Q -30 35, 0 17.5 Q 30 0, 60 17.5 Q 90 35, 120 17.5 Q 150 0, 180 17.5 Q 210 35, 240 17.5"
              fill="none"
              stroke="url(#liquidGradient)"
              strokeOpacity="0.6"
              strokeWidth="2.5"
            />
          </pattern>

          {/* 波浪效果 - 后层 */}
          <pattern id="waveBack" x="0" y="0" width="220" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M -80 15 Q -40 30, 0 15 Q 40 0, 80 15 Q 120 30, 160 15 Q 200 0, 240 15 Q 280 30, 320 15"
              fill="none"
              stroke="url(#liquidGradient)"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
          </pattern>

          <mask id="liquidMask">
            <motion.rect
              x="0"
              y="0"
              width="400"
              height="200"
              fill="white"
              initial={{ y: 200 }}
              animate={{ y: 100 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </mask>
        </defs>

        {/* 背景填充 */}
        <rect
          x="0"
          y="0"
          width="400"
          height="200"
          fill="url(#liquidGradient)"
          opacity="0.1"
        />

        {/* 后层波浪 */}
        <motion.g
          initial={{ x: -220, y: 0 }}
          animate={{ 
            x: 0,
            y: [0, -10, 5, -3, 0]
          }}
          transition={{
            x: { duration: 20, repeat: Infinity, ease: "linear" },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <rect x="-220" y="0" width="840" height="200" fill="url(#waveBack)" mask="url(#liquidMask)" />
        </motion.g>

        {/* 中层波浪 */}
        <motion.g
          initial={{ x: 180, y: 0 }}
          animate={{ 
            x: -180,
            y: [0, 8, -6, 3, 0]
          }}
          transition={{
            x: { duration: 15, repeat: Infinity, ease: "linear" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <rect x="-180" y="0" width="760" height="200" fill="url(#waveMiddle)" mask="url(#liquidMask)" />
        </motion.g>

        {/* 前层波浪 */}
        <motion.g
          initial={{ x: -140, y: 0 }}
          animate={{ 
            x: 140,
            y: [0, -6, 8, -4, 0]
          }}
          transition={{
            x: { duration: 10, repeat: Infinity, ease: "linear" },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <rect x="-140" y="0" width="680" height="200" fill="url(#waveFront)" mask="url(#liquidMask)" />
        </motion.g>

        {/* 文字 */}
        <g className="drop-shadow-lg">
          <text
            x="200"
            y="70"
            textAnchor="middle"
            className="text-2xl font-bold fill-blue-300"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(96, 165, 250, 0.3))',
              letterSpacing: '0.05em'
            }}
          >
            {t("Total USDT Volume")}
          </text>
          <text
            x="200"
            y="120"
            textAnchor="middle"
            className="text-4xl font-bold fill-white"
            style={{ 
              filter: 'drop-shadow(0 2px 8px rgba(96, 165, 250, 0.5))',
              letterSpacing: '0.02em'
            }}
          >
            {displayedUSDT.toLocaleString()} USDT
          </text>
        </g>
      </svg>

      {/* 装饰性粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute particle ${
              i % 2 === 0 ? 'particle-large' : 'particle-small'
            }`}
            initial={{
              x: Math.random() * 100 + '%',
              y: '100%',
              scale: Math.random() * 0.8 + 0.5,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: '0%',
              x: `${Math.random() * 30 - 15 + parseInt(String(Math.random() * 100))}%`,
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
} 
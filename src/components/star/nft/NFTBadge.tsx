interface NFTBadgeProps {
  level: number;
  size?: number;
}

const LEVEL_COLORS: Record<number, [string, string]> = {
  1: ["#9333EA", "#7E22CE"],  // 紫色
  2: ["#3B82F6", "#2563EB"],  // 蓝色
  3: ["#F59E0B", "#D97706"],  // 金色
  4: ["#EC4899", "#DB2777"]   // 粉色
};

export function NFTBadge({ level, size = 100 }: NFTBadgeProps) {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS[1]; // 默认使用 level 1 的颜色

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      {/* 背景模糊效果 */}
      <div 
        className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-xl"
        style={{
          transform: 'scale(1.2)',
          filter: 'blur(20px)',
          opacity: 0.6,
          willChange: 'transform'
        }}
      />

      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        className="relative z-10 transform-gpu"
        style={{ 
          maxWidth: size, 
          maxHeight: size,
          willChange: 'transform'
        }}
      >
        <defs>
          <linearGradient id={`grad-${level}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors[0] }}>
              <animate
                attributeName="stop-color"
                values={`${colors[0]};${colors[1]};${colors[0]}`}
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" style={{ stopColor: colors[1] }}>
              <animate
                attributeName="stop-color"
                values={`${colors[1]};${colors[0]};${colors[1]}`}
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          
          <filter id={`glow-${level}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 背景圆圈 */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill={`url(#grad-${level})`}
          filter={`url(#glow-${level})`}
          className="transform-gpu"
        >
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* 旋转容器 */}
        <g className="transform-gpu">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur={`${20 - Math.min(level * 3, 15)}s`}
            repeatCount="indefinite"
          />
          
          {/* 星星 */}
          {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
            <g key={i} transform={`rotate(${i * (360 / level)} 50 50)`}>
              <path
                d="M50 20L53 30L64 30L55 36L58 46L50 40L42 46L45 36L36 30L47 30L50 20Z"
                fill="white"
                opacity="0.9"
                filter={`url(#glow-${level})`}
                className="transform-gpu"
              >
                <animate
                  attributeName="opacity"
                  values="0.7;1;0.7"
                  dur={`${1.5 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </path>
            </g>
          ))}
        </g>

        {/* 中心光点 */}
        <circle
          cx="50"
          cy="50"
          r="2"
          fill="white"
          filter={`url(#glow-${level})`}
          className="transform-gpu"
        >
          <animate
            attributeName="r"
            values="2;3;2"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

// ... 代码保持不变 
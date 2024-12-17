import { SVGProps } from 'react';

export function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* 左上方的大方块 */}
      <path d="M4 4h8v8H4z" className="opacity-90" />
      
      {/* 右上方的小方块 */}
      <path d="M16 4h4v4h-4z" className="opacity-80" />
      
      {/* 右中间的小方块 */}
      <path d="M16 12h4v4h-4z" className="opacity-70" />
      
      {/* 左下方的小方块 */}
      <path d="M4 16h4v4H4z" className="opacity-80" />
      
      {/* 右下方的小方块 */}
      <path d="M12 16h4v4h-4z" className="opacity-70" />
    </svg>
  );
}

export default DashboardIcon; 
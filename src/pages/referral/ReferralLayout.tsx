import { Outlet } from 'react-router-dom';
import { ReferralNav } from './components/ReferralNav';

export function ReferralLayout() {
  return (
    <div className="space-y-6">
      {/* 导航 */}
      <ReferralNav />
      
      {/* 内容区域 */}
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
} 
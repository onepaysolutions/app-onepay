import { ReactNode } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CardContainer } from '@/components/layout/CardContainer';

interface ProfileLayoutProps {
  children: ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <PageContainer withHeader={false} size="md">
      {/* 顶部背景和头像 */}
      <div className="relative -mx-4 sm:-mx-6 md:-mx-8">
        {/* 背景图 */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-purple-600 to-blue-600 safe-area-top" />
        
        {/* 个人信息卡片 */}
        <div className="absolute left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 -bottom-24 md:-bottom-20">
          <CardContainer>
            {children}
          </CardContainer>
        </div>
      </div>
    </PageContainer>
  );
} 
import React from 'react';

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      {/* 性能统计骨架屏 */}
      <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-xl p-6">
        <div className="h-6 w-32 bg-purple-900/40 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-purple-900/20 rounded-lg"></div>
          <div className="h-24 bg-purple-900/20 rounded-lg"></div>
        </div>
      </div>

      {/* 团队统计骨架屏 */}
      <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-xl p-6">
        <div className="h-6 w-32 bg-purple-900/40 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-purple-900/20 rounded-lg"></div>
          <div className="h-24 bg-purple-900/20 rounded-lg"></div>
        </div>
      </div>

      {/* 邮箱部分骨架屏 */}
      <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-xl p-6">
        <div className="h-6 w-32 bg-purple-900/40 rounded mb-4"></div>
        <div className="h-12 bg-purple-900/20 rounded-lg"></div>
      </div>
    </div>
  );
} 
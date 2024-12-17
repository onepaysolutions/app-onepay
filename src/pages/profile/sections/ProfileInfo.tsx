import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { supabase } from '@/lib/supabase';
import { truncateAddress } from '@/utils/address';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export function ProfileInfo() {
  // ... 原有的 profile 相关逻辑

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-purple-900/20 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        {/* ... 基本信息内容 */}
      </div>

      {/* Social Links */}
      <div className="bg-purple-900/20 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
        {/* ... 社交链接内容 */}
      </div>
    </div>
  );
} 
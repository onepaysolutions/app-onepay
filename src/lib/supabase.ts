import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// 使用 VITE_ 前缀的环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// 客户端配置选项
const clientOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' }
  },
  // 添加重试配置
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  // 设置较长的超时时间
  fetch: (url: string, options: RequestInit) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Connection': 'keep-alive'
      }
    })
  }
};

// 创建公共客户端实例
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  { ...clientOptions, db: { ...clientOptions.db, schema: 'public' } }
);

// 创建管理员客户端实例
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    ...clientOptions,
    auth: {
      ...clientOptions.auth,
      persistSession: false
    },
    db: {
      ...clientOptions.db,
      schema: 'public' as const
    }
  }
);

// 测试连接函数
export async function testConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ops_presale_stages')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error(`Connection attempt ${i + 1} failed:`, error);
        if (i === retries - 1) return false;
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      console.log('Supabase connection test: Success');
      return true;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        console.error('All connection attempts failed');
        return false;
      }
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
}

// 默认导出管理员客户端
export default supabaseAdmin; 
import { supabase } from './supabase';

export async function checkAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth error:', error);
    throw new Error('Authentication failed');
  }
  
  if (!session) {
    throw new Error('Not authenticated');
  }
  
  return session;
}

export async function getAuthToken() {
  const session = await checkAuth();
  return session.access_token;
}

export async function registerUser(walletAddress: string, referrerAddress?: string, placementArea?: string) {
  try {
    // 检查用户是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('walletaddress')
      .eq('walletaddress', walletAddress.toLowerCase())
      .single();

    if (existingUser) {
      return { error: 'User already exists' };
    }

    // 插入新用户
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          walletaddress: walletAddress.toLowerCase(),
          referreraddress: referrerAddress?.toLowerCase(),
          placementarea: placementArea,
          isactive: true
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // 触发器会自动处理用户关系的记录

    return { data };
  } catch (error) {
    console.error('Error registering user:', error);
    return { error };
  }
}

// 获取用户的推荐关系
export async function getUserRelationships(walletAddress: string) {
  try {
    const { data, error } = await supabase
      .from('userrelationships')
      .select(`
        referreraddress,
        level,
        users!referreraddress(walletaddress)
      `)
      .eq('useraddress', walletAddress.toLowerCase())
      .order('level');

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error getting user relationships:', error);
    return { error };
  }
}

// 获取用户的直接推荐人
export async function getDirectReferrer(walletAddress: string) {
  try {
    const { data, error } = await supabase
      .from('userrelationships')
      .select('referreraddress')
      .eq('useraddress', walletAddress.toLowerCase())
      .eq('level', 1)
      .single();

    if (error) throw error;
    return { data: data.referreraddress };
  } catch (error) {
    console.error('Error getting direct referrer:', error);
    return { error };
  }
}

// 获取用户的所有下级
export async function getDownlineUsers(walletAddress: string, level?: number) {
  try {
    let query = supabase
      .from('userrelationships')
      .select(`
        useraddress,
        level,
        users!useraddress(walletaddress)
      `)
      .eq('referreraddress', walletAddress.toLowerCase());
    
    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query.order('level');
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error getting downline users:', error);
    return { error };
  }
} 
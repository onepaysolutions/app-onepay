import { supabase } from '@/lib/supabase';
import type { ReferralNode } from '@/types/database.types';

export class ReferralService {
  // 获取推荐树数据
  static async fetchReferralTree(address: string): Promise<ReferralNode> {
    try {
      const normalizedAddress = address.toLowerCase();

      // 获取用户及其所有下级
      const { data: referralData, error } = await supabase
        .from('userrelationships')
        .select(`
          useraddress,
          referreraddress,
          level,
          users!useraddress (
            walletaddress,
            isactive,
            placementarea
          )
        `)
        .or(`referreraddress.ilike.${normalizedAddress},useraddress.ilike.${normalizedAddress}`)
        .order('level');

      if (error) throw error;

      // 构建树形结构
      const rootNode: ReferralNode = {
        useraddress: normalizedAddress,
        parentaddress: null,
        tier: 0,
        path: [normalizedAddress],
        isactive: true,
        memberstatus: 'Active',
        placementarea: null,
        children: []
      };

      // 递归构建子树
      const buildChildren = (parentAddress: string, currentTier: number): ReferralNode[] => {
        return referralData
          .filter(node => node.referreraddress?.toLowerCase() === parentAddress.toLowerCase())
          .map(node => {
            const userAddress = node.useraddress.toLowerCase();
            const userData = node.users;
            
            return {
              useraddress: userAddress,
              parentaddress: node.referreraddress?.toLowerCase(),
              tier: currentTier,
              path: [...rootNode.path, userAddress],
              isactive: userData[0]?.isactive || false,
              memberstatus: userData[0]?.isactive ? 'Active' : 'Inactive',
              placementarea: userData[0]?.placementarea,
              children: buildChildren(userAddress, currentTier + 1)
            };
          });
      };

      // 构建完整的树
      rootNode.children = buildChildren(normalizedAddress, 1);

      return rootNode;
    } catch (error) {
      console.error('Error fetching referral tree:', error);
      throw error;
    }
  }

  // 获取直接推荐人数量
  static async getDirectReferralsCount(address: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('userrelationships')
        .select('count')
        .eq('referreraddress', address.toLowerCase())
        .eq('level', 1)
        .single();

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting direct referrals count:', error);
      return 0;
    }
  }

  // 获取团队总人数
  static async getTeamSize(address: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('userrelationships')
        .select('count')
        .eq('referreraddress', address.toLowerCase());

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting team size:', error);
      return 0;
    }
  }

  // 订阅推荐关系更新
  static subscribeToReferralUpdates(address: string, callback: () => void) {
    const subscription = supabase
      .channel('referral-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'userrelationships',
          filter: `referreraddress=eq.${address.toLowerCase()}`
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  static validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  static async cleanupInvalidData() {
    const { data, error } = await supabase
      .from('users')
      .delete()
      
    
    if (error) {
      console.error('清理无效数据时出错:', error);
    }
    return data;
  }
} 
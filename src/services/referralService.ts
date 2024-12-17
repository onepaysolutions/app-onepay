import { supabase } from '@/lib/supabase';
import { Database, ReferralNode, UserRow } from '@/types/database.types';

export class ReferralService {
  private static subscription: any;

  static subscribeToReferralUpdates(address: string, onUpdate: () => void) {
    // 取消之前的订阅
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // 订阅通知表
    this.subscription = supabase
      .channel('referral_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_address=eq.${address.toLowerCase()}`
        },
        (payload) => {
          if (payload.new.type === 'NEW_REFERRAL') {
            onUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
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
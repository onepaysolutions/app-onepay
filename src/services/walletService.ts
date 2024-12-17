import { supabaseAdmin } from "@/lib/supabase/supabase";

export async function updateWalletLoginInfo(walletId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('wallets')
      .update({ 
        last_login_at: new Date().toISOString(),
        login_count: 
        supabaseAdmin.from('wallets').select('login_count').eq('id', walletId).single().
        then(data => data.data ? data.data.login_count + 1 : 1)
      })  
      .eq('id', walletId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating wallet login info:', error);
    throw error;
  }
} 
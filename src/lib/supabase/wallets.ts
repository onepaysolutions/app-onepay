import { supabase } from '@/lib/supabase/supabase';
import { Wallet } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

interface WalletInsert {
  id: string;
  walletaddress: string;
  referrerwallet?: string | null;
  referralpath?: string | null;
  placementarea?: string;
  level: number;
  createdat: string;
  updatedat: string;
  userid?: string | null;
}

async function ensureAnonymousSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    await supabase.auth.signInAnonymously();
  }
}

export async function getWalletByAddress(address: string): Promise<Wallet | null> {
  try {
    await ensureAnonymousSession();

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('walletaddress', address.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    return data ? {
      ...data,
      createdat: new Date(data.createdat),
      updatedat: new Date(data.updatedat)
    } : null;
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return null;
  }
}

export async function createWallet(
  address: string,
  referredBy?: string,
  referralPath?: string,
  placementArea: string = 'MIDDLE'
): Promise<Wallet | null> {
  try {
    await ensureAnonymousSession();

    const now = new Date().toISOString();
    const insertData: WalletInsert = {
      id: uuidv4(),
      walletaddress: address.toLowerCase(),
      referrerwallet: referredBy?.toLowerCase() || null,
      referralpath: referralPath || null,
      placementarea: placementArea,
      level: 1,
      createdat: now,
      updatedat: now,
      userid: null
    };

    const { data, error } = await supabase
      .from('wallets')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      createdat: new Date(data.createdat),
      updatedat: new Date(data.updatedat)
    } : null;
  } catch (error) {
    console.error('Error creating wallet:', error);
    return null;
  }
}

export async function updateWalletLoginInfo(walletId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('wallets')
      .update({ updatedat: new Date().toISOString() })
      .eq('id', walletId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating wallet:', error);
  }
}
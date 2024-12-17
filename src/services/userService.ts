import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/user';

export async function getUserProfile(address: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('userProfiles')
    .select('*')
    .eq('walletAddress', address.toLowerCase())
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(
  address: string,
  updates: Partial<UserProfile>
): Promise<void> {
  const { error } = await supabase
    .from('userProfiles')
    .update(updates)
    .eq('walletAddress', address.toLowerCase());

  if (error) throw error;
}

export async function updateUserSocial(
  address: string,
  social: UserProfile['social']
): Promise<void> {
  const { error } = await supabase
    .rpc('updateUserSocial', {
      walletAddress: address.toLowerCase(),
      socialData: social
    });

  if (error) throw error;
} 
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
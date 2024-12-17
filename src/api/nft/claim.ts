import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    if (data.type === 'ANGEL') {
      const { data: nft, error } = await supabase
        .from('angel_nfts')
        .insert({
          token_id: data.tokenId,
          wallet_address: data.walletAddress.toLowerCase(),
          type: 'ANGEL',
          level: 1,
          power: 1000,
          status: 'ACTIVE',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return Response.json(nft);
    } else {
      const { data: nft, error } = await supabase
        .from('star_nfts')
        .insert({
          token_id: data.tokenId,
          wallet_address: data.walletAddress.toLowerCase(),
          star_level: 1,
          contract_value: '0',
          ops_holding: '0',
          ops_rewards: '0',
          current_value: '0',
          release_rate: '0',
          status: 'ACTIVE',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return Response.json(nft);
    }
  } catch (error) {
    console.error('Error in claim API:', error);
    return Response.json({ error: 'Failed to record claim' }, { status: 500 });
  }
} 
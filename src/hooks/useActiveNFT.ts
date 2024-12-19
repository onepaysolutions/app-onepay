import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useActiveNFT(address?: string) {
  const [nftLevel, setNFTLevel] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNFTInfo() {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('star_nfts')
          .select('level')
          .eq('wallet_address', address)
          .single();

        if (error) {
          console.error('Error fetching NFT info:', error);
          setNFTLevel(0);
        } else {
          setNFTLevel(data?.level || 0);
        }
      } catch (err) {
        console.error('Error:', err);
        setNFTLevel(0);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTInfo();
  }, [address]);

  return { nftLevel, loading };
} 
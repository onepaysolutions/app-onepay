import supabase from "@/lib/supabase";

// 使用 supabase 的 api 而不是 starNftDB
const fetchNFTData = async (address: string) => {
  try {
    const { data, error } = await supabase
      .from('star_nfts')
      .select(`
        *,
        owner:users!owner_id (
          id,
          nickname
        )
      `)
      .eq('owner_address', address.toLowerCase());

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    return [];
  }
}; 
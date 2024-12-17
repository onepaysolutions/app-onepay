import { supabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
type Tables = Database['public']['Tables'];
type TierRewardRow = Tables['tier_rewards']['Row'];
type TierRewardInsert = Tables['tier_rewards']['Insert'];
type PairRewardRow = Tables['pair_rewards']['Row'];
type PairRewardInsert = Tables['pair_rewards']['Insert'];

// 添加类型定义
interface ReferralWithNFT {
  id: string;
  level: number;
  referrer: {
    id: string;
    star_nfts: Array<{
      id: number;
      level: number;
      status: string;
    }>;
  };
}

// 分配层级奖励
export async function distributeTierRewards(
  presaleId: number,
  presaleAmount: number,
  referrerId: string,
  maxLevel: number
) {
  try {
    // 1. 获取推荐关系链和 Star NFT 状态
    const { data: referrals, error: refError } = await supabaseAdmin
      .from('referral_relations')
      .select(`
        id,
        level,
        referrer:users!referrer_id (
          id,
          star_nfts!star_nfts_user_id_fkey (
            id,
            level,
            status
          )
        )
      `) as { data: ReferralWithNFT[] | null, error: any };

    if (refError) throw refError;

    // 在处理 referrals 之前添加空值检查
    if (!referrals) return;

    // 2. 计算并分配每层奖励
    let remainingReward = presaleAmount * 0.49; // 49% 总奖励池
    const rewardPerTier = remainingReward / 20; // 每层基础奖励

    for (const ref of referrals) {
      // 检查是否有激活的 Star NFT
      const activeNFT = ref.referrer?.star_nfts?.find((nft: { status: string }) => 
        nft.status === 'active'
      );

      if (!activeNFT) {
        // 如果没有激活的 NFT，这层的奖励需要向上 rollup
        continue;
      }

      // 获取该 NFT 等级可以获得的最大层级数
      const maxTiersByLevel = getMaxTiersByLevel(activeNFT.level);
      
      // 如果当前层级超过了 NFT 等级允许的最大层级，这层奖励也需要向上 rollup
      if (ref.level > maxTiersByLevel) {
        continue;
      }

      // 创建层级奖励记录
      const tierReward: TierRewardInsert = {
        nft_id: activeNFT.id,
        presale_id: presaleId,
        level: ref.level,
        amount: rewardPerTier.toString(),
        status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: tierError } = await supabaseAdmin
        .from('tier_rewards')
        .insert(tierReward);

      if (tierError) throw tierError;

      // 从剩余奖励中扣除已分配部分
      remainingReward -= rewardPerTier;
    }

    // 如果还有剩余奖励（由于某些层级没有激活的 NFT），
    // 可以将剩余奖励分配给最高层级的激活 NFT
    if (remainingReward > 0 && referrals) {
      const highestActiveRef = referrals.slice().reverse().find(ref => 
        ref.referrer?.star_nfts?.some((nft: { status: string }) => nft.status === 'active')
      );

      if (highestActiveRef) {
        const activeNFT = highestActiveRef.referrer?.star_nfts.find((nft: { status: string }) => 
          nft.status === 'active'
        );

        if (activeNFT) {
          const rollupReward: TierRewardInsert = {
            nft_id: activeNFT.id,
            presale_id: presaleId,
            level: 0, // 0 表示这是 rollup 奖励
            amount: remainingReward.toString(),
            status: 'PENDING',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          await supabaseAdmin
            .from('tier_rewards')
            .insert(rollupReward);
        }
      }
    }
  } catch (error) {
    console.error('Error distributing tier rewards:', error);
    throw error;
  }
}

// 分配配对奖励
export async function distributePairRewards(
  tierRewardId: number,
  referrerId: string,
  maxGenerations: number
) {
  try {
    // 1. 获取上级的 Star NFT 状态
    const { data: uplines, error: upError } = await supabaseAdmin
      .from('referral_relations')
      .select(`
        id,
        level,
        referrer:users!referrer_id (
          id,
          star_nfts!star_nfts_user_id_fkey (
            id,
            level,
            status
          )
        )
      `)
      .eq('referee_id', referrerId)
      .order('level', { ascending: true })
      .limit(maxGenerations) as { data: ReferralWithNFT[] | null, error: any };

    if (upError) throw upError;

    // 添加空值检查
    if (!uplines) return;

    // 2. 计算并分配每代配对奖励
    const pairRates = [0.05, 0.03, 0.02]; // 5%, 3%, 2%

    for (let i = 0; i < uplines.length; i++) {
      // 检查是否有激活的 Star NFT
      const activeNFT = uplines[i].referrer?.star_nfts?.find(nft => 
        nft.status === 'active'
      );

      if (!activeNFT) continue;

      // 检查 NFT 等级是否允许获得这一代的配对奖励
      const maxPairGen = getPairGenerationsByLevel(activeNFT.level);
      if (i + 1 > maxPairGen) continue;

      // 创建配对奖励记录
      const pairReward: PairRewardInsert = {
        nft_id: activeNFT.id,
        tier_reward_id: tierRewardId,
        generation: i + 1,
        amount: (pairRates[i] * 100).toString(),
        status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: pairError } = await supabaseAdmin
        .from('pair_rewards')
        .insert(pairReward);

      if (pairError) throw pairError;
    }
  } catch (error) {
    console.error('Error distributing pair rewards:', error);
    throw error;
  }
}

// 根据 NFT 等级取最大层级数
function getMaxTiersByLevel(level: number): number {
  switch (level) {
    case 1: return 3;
    case 2: return 8;
    case 3: return 13;
    case 4: return 20;
    default: return 0;
  }
}

// 根据 NFT 等级获取最大配对代数
function getPairGenerationsByLevel(level: number): number {
  switch (level) {
    case 1: return 0;
    case 2: return 1;
    case 3: return 2;
    case 4: return 3;
    default: return 0;
  }
} 
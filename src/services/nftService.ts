import { supabaseAdmin } from '@/lib/supabase';
import { StarNFTLevel, ActiveNFT, ReleaseNFT } from '@/types/nfts';
import { getCurrentPresaleStage, updatePresaleProgress } from './opsService';

// Claim Star NFT
export async function claimStarNFT(
  walletAddress: string, 
  nftLevel: StarNFTLevel
) {
  try {
    // 获取当前预售阶段
    const currentStage = await getCurrentPresaleStage();
    
    // 开始数据库事务
    const { data: nft, error: nftError } = await supabaseAdmin
      .from('star_nfts')
      .insert({
        owner_address: walletAddress.toLowerCase(),
        level: nftLevel.id,
        status: 'active',
        contract_value: nftLevel.contractValue,
        presale_value: nftLevel.presaleValue,
        current_value: nftLevel.price,
        cycle: currentStage?.cycle || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (nftError) throw nftError;

    // 创建钱包分配记录
    const allocations = [
      {
        nft_id: nft.id,
        wallet_type: 'presale',
        amount: nftLevel.price * (nftLevel.allocation.presale / 100)
      },
      {
        nft_id: nft.id,
        wallet_type: 'rewards',
        amount: nftLevel.price * (nftLevel.allocation.rewards / 100)
      },
      {
        nft_id: nft.id,
        wallet_type: 'ope_buyback',
        amount: nftLevel.price * (nftLevel.allocation.opeBuyback / 100)
      },
      {
        nft_id: nft.id,
        wallet_type: 'ops_pool',
        amount: nftLevel.price * (nftLevel.allocation.opsPool / 100)
      }
    ];

    const { error: allocError } = await supabaseAdmin
      .from('nft_allocations')
      .insert(allocations);

    if (allocError) throw allocError;

    // 触发预售购买
    if (currentStage) {
      await createPresalePurchase(nft.id, nftLevel, currentStage);
    }

    return nft;
  } catch (error) {
    console.error('Error claiming Star NFT:', error);
    throw error;
  }
}

// 创建预售购买记录
async function createPresalePurchase(
  nftId: number, 
  nftLevel: StarNFTLevel,
  currentStage: any
) {
  try {
    const presaleAmount = nftLevel.price * (nftLevel.allocation.presale / 100);
    const opsAmount = calculateOPSAmount(presaleAmount, currentStage.price);
    
    // 记录预售购买
    const { error } = await supabaseAdmin
      .from('ops_presale_purchases')
      .insert({
        nft_id: nftId,
        stage_id: currentStage.id,
        amount_usdc: presaleAmount,
        ops_amount: opsAmount,
        status: 'completed'
      });

    if (error) throw error;

    // 更新预售阶段进度
    await updatePresaleProgress(currentStage.id, opsAmount);
  } catch (error) {
    console.error('Error creating presale purchase:', error);
    throw error;
  }
}

// 获取激活的NFTs
export async function getActiveNFTs(walletAddress: string): Promise<ActiveNFT[]> {
  const { data, error } = await supabaseAdmin
    .from('star_nfts')
    .select(`
      *,
      ops_presale_purchases(ops_amount),
      ops_airdrops(amount),
      ops_rewards(amount)
    `)
    .eq('owner_address', walletAddress)
    .eq('status', 'active');

  if (error) throw error;

  const currentStage = await getCurrentPresaleStage();

  return data.map(nft => ({
    id: nft.id,
    level: nft.level,
    presaleOPS: nft.ops_presale_purchases.reduce((sum: number, p: { ops_amount: number }) => 
      sum + p.ops_amount, 0),
    airdropOPS: nft.ops_airdrops.reduce((sum: number, a: { amount: number }) => 
      sum + a.amount, 0),
    rewardsOPS: nft.ops_rewards.reduce((sum: number, r: { amount: number }) => 
      sum + r.amount, 0),
    currentPrice: currentStage.price,
    contractValue: nft.contract_value,
    status: 'active'
  }));
}

// 获取可释放的NFTs
export async function getReleaseNFTs(walletAddress: string): Promise<ReleaseNFT[]> {
  const { data, error } = await supabaseAdmin
    .from('star_nfts')
    .select(`
      *,
      ops_presale_purchases(ops_amount),
      ops_airdrops(amount),
      ops_rewards(amount)
    `)
    .eq('owner_address', walletAddress)
    .eq('status', 'release');

  if (error) throw error;

  // 获取周期起始价格
  const cycleStartPrice = await getCycleStartPrice();

  return data.map(nft => ({
    id: nft.id,
    level: nft.level,
    totalOPS: calculateTotalOPS(nft),
    userReleaseRatio: 0,
    platformLiquidityRatio: 10,
    platformBuybackRatio: 5,
    opsReleaseRatio: 15,
    cycleStartPrice
  }));
}

// 释放NFT
export async function releaseNFT(nftId: number, calculation: any) {
  try {
    // 创建释放记录
    const { error: releaseError } = await supabaseAdmin
      .from('nft_releases')
      .insert({
        nft_id: nftId,
        total_ops: calculation.totalOPS,
        user_release_ratio: calculation.userReleaseRatio,
        user_usdc_amount: calculation.userUSDC,
        user_ops_amount: calculation.userOPS,
        platform_liquidity_usdc: calculation.platformLiquidityUSDC,
        platform_liquidity_ops: calculation.platformLiquidityOPS,
        platform_buyback_usdc: calculation.platformBuybackUSDC,
        ops_release_amount: calculation.opsRelease,
        cycle_start_price: calculation.cycleStartPrice,
        status: 'completed'
      });

    if (releaseError) throw releaseError;

    // 更新NFT状态为burned
    const { error: updateError } = await supabaseAdmin
      .from('star_nfts')
      .update({ status: 'burned' })
      .eq('id', nftId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error releasing NFT:', error);
    throw error;
  }
}

// 辅助函数
function calculateOPSAmount(usdcAmount: number, currentPrice: number): number {
  return usdcAmount / currentPrice;
}

function calculateTotalOPS(nft: any): number {
  const presaleOPS = nft.ops_presale_purchases.reduce((sum: number, p: { ops_amount: number }) => 
    sum + p.ops_amount, 0);
  const airdropOPS = nft.ops_airdrops.reduce((sum: number, a: { amount: number }) => 
    sum + a.amount, 0);
  const rewardsOPS = nft.ops_rewards.reduce((sum: number, r: { amount: number }) => 
    sum + r.amount, 0);
  
  return presaleOPS + airdropOPS + rewardsOPS;
}

async function getCycleStartPrice(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('ops_presale_stages')
    .select('price')
    .eq('stage', 1)
    .order('cycle', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data.price;
}
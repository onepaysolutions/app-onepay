import { supabaseAdmin } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type PresaleStageRow = Tables['ops_presale_stages']['Row'];
type PresaleStageInsert = Omit<PresaleStageRow, 'id'>;
type PresaleStageUpdate = Partial<PresaleStageRow>;

export type PresaleStageStatus = 'upcoming' | 'active' | 'completed';

// 初始化预售阶段
export async function initializePresaleStages() {
  try {
    // 检查是否已经初始化
    const { data: existingStages, error: checkError } = await supabaseAdmin
      .from('ops_presale_stages')
      .select('id')
      .limit(1);

    if (checkError) throw checkError;
    
    // 如果已经有数据，则不需要初始化
    if (existingStages && existingStages.length > 0) {
      console.log('Presale stages already initialized');
      return;
    }

    // 创建第一个周期的20个阶段
    const stages: PresaleStageInsert[] = Array.from({ length: 20 }, (_, i) => ({
      cycle: 1,
      stage: i + 1,
      price: Number((0.3 + i * 0.01).toFixed(3)),
      total_amount: 100000,
      sold_amount: 0,
      status: i === 0 ? 'active' : 'upcoming',
      start_time: i === 0 ? new Date().toISOString() : null,
      end_time: null,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabaseAdmin
      .from('ops_presale_stages')
      .insert(stages);

    if (error) throw error;

    console.log('Presale stages initialized successfully');
  } catch (error) {
    console.error('Error initializing presale stages:', error);
    throw error;
  }
}

// 获取所有预售阶段信息
export async function getAllPresaleStages() {
  const { data, error } = await supabaseAdmin
    .from('ops_presale_stages')
    .select('*')
    .order('cycle', { ascending: true })
    .order('stage', { ascending: true });

  if (error) throw error;
  return data as PresaleStageRow[];
}

// 获取当前活跃的预售阶段
export async function getCurrentPresaleStage() {
  const { data, error } = await supabaseAdmin
    .from('ops_presale_stages')
    .select('*')
    .eq('status', 'active')
    .single();

  if (error) throw error;
  return data as PresaleStageRow;
}

// 更新预售阶段进度
export async function updatePresaleProgress(stageId: number, amount: number) {
  try {
    // 获取当前阶段信息
    const { data: stage, error: stageError } = await supabaseAdmin
      .from('ops_presale_stages')
      .select('*')
      .eq('id', stageId)
      .single();

    if (stageError) throw stageError;
    if (!stage) throw new Error('Stage not found');

    const stageData = stage as PresaleStageRow;
    const newSoldAmount = stageData.sold_amount + amount;
    
    // 更新当前阶段销售量
    const updateData: PresaleStageUpdate = {
      sold_amount: newSoldAmount,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabaseAdmin
      .from('ops_presale_stages')
      .update(updateData)
      .eq('id', stageId);

    if (updateError) throw updateError;

    // 如果达到目标，激活下一阶段
    if (newSoldAmount >= stageData.total_amount) {
      await activateNextStage(stageData);
    }
  } catch (error) {
    console.error('Error updating presale progress:', error);
    throw error;
  }
}

// 激活下一个阶段
async function activateNextStage(currentStage: PresaleStageRow) {
  try {
    // 更新当前阶段状态为已完成
    const completeUpdate: PresaleStageUpdate = {
      status: 'completed',
      end_time: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await supabaseAdmin
      .from('ops_presale_stages')
      .update(completeUpdate)
      .eq('id', currentStage.id);

    // 如果是周期的最后一个阶段
    if (currentStage.stage === 20) {
      await handleCycleEnd(currentStage.cycle);
    } else {
      // 激活下一个阶段
      const nextStageUpdate: PresaleStageUpdate = {
        start_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await supabaseAdmin
        .from('ops_presale_stages')
        .update(nextStageUpdate)
        .eq('cycle', currentStage.cycle)
        .eq('stage', currentStage.stage + 1);
    }
  } catch (error) {
    console.error('Error activating next stage:', error);
    throw error;
  }
}

// 处理周期结束
async function handleCycleEnd(currentCycle: number) {
  try {
    // 触发空投
    await triggerCycleAirdrop(currentCycle);
    // 创建新周期的阶段
    const newStages: PresaleStageInsert[] = Array.from({ length: 20 }, (_, i) => ({
      cycle: currentCycle + 1,
      stage: i + 1,
      price: Number((0.3 + i * 0.01).toFixed(3)),
      total_amount: 100000,
      sold_amount: 0,
      status: i === 0 ? 'active' : 'upcoming',
      start_time: i === 0 ? new Date().toISOString() : null,
      end_time: null,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabaseAdmin
      .from('ops_presale_stages')
      .insert(newStages);

    if (error) throw error;
  } catch (error) {
    console.error('Error handling cycle end:', error);
    throw error;
  }
}

// 触发周期空投
async function triggerCycleAirdrop(cycle: number) {
  try {
    // 获取所有激活状态的NFTs
    const { data: activeNFTs, error: nftsError } = await supabaseAdmin
      .from('star_nfts')
      .select(`
        id,
        ops_presale_purchases(ops_amount),
        ops_airdrops(amount),
        ops_rewards(amount)
      `)
      .eq('status', 'active');

    if (nftsError) throw nftsError;

    // 为每个活的NFT创建空投记录
    const airdrops = activeNFTs.map(nft => {
      const totalOPS = calculateTotalOPS(nft);
      return {
        nft_id: nft.id,
        cycle: cycle,
        amount: Math.floor(totalOPS * 0.5), // 50% 空投比例，向下取整
        status: 'completed'
      };
    });

    if (airdrops.length > 0) {
      const { error: airdropError } = await supabaseAdmin
        .from('ops_airdrops')
        .insert(airdrops);

      if (airdropError) throw airdropError;
    }
  } catch (error) {
    console.error('Error triggering cycle airdrop:', error);
    throw error;
  }
}

// 计算NFT的总OPS持有量
function calculateTotalOPS(nft: any): number {
  const presaleOPS = nft.ops_presale_purchases.reduce((sum: number, p: { ops_amount: number }) => 
    sum + p.ops_amount, 0);
  const airdropOPS = nft.ops_airdrops.reduce((sum: number, a: { amount: number }) => 
    sum + a.amount, 0);
  const rewardsOPS = nft.ops_rewards.reduce((sum: number, r: { amount: number }) => 
    sum + r.amount, 0);
  
  return presaleOPS + airdropOPS + rewardsOPS;
} 

// 获取当前周期起始价格
export async function getCurrentCycleStartPrice(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('ops_presale_stages')
    .select('price')
    .eq('status', 'active')
    .single();

  if (error) throw error;
  
  const presaleStage = data as PresaleStageRow;
  if (!presaleStage || typeof presaleStage.price !== 'number') {
    throw new Error('data is null');
  }
  
  return presaleStage.price;
}

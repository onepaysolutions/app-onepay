import { useState, useEffect } from 'react';
import { ReleaseNFT, ReleaseCalculation } from '@/types/nfts';
import { ReleaseNFTCard } from '@/components/star/nft/ReleaseNFTCard';
import { motion } from 'framer-motion';
import { supabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { number } from 'zod';

type Tables = Database['public']['Tables'];
type NFTRow = Tables['star_nfts']['Row'];
type NFTReleaseInsert = Tables['nft_transactions']['Insert'];
type NFTUpdate = Tables['star_nfts']['Update'];
type PresaleStageRow = Tables['ops_presale_purchases']['Row'];
  
interface ReleaseNFTsListProps {
  walletAddress: string;
}

export function ReleaseNFTsList({ walletAddress }: ReleaseNFTsListProps) {
  const [releaseNFTs, setReleaseNFTs] = useState<ReleaseNFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<ReleaseNFT | null>(null);
  const [showCalculation, setShowCalculation] = useState(false);
  const [calculation, setCalculation] = useState<ReleaseCalculation | null>(null);

  useEffect(() => {
    fetchReleaseNFTs();
  }, [walletAddress]);

  const fetchReleaseNFTs = async () => {
    try {
      const { data: nftsData, error } = await supabaseAdmin
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
      if (!nftsData) return;

      const nfts: ReleaseNFT[] = await Promise.all(nftsData.map(async (nft: NFTRow & {
        ops_presale_purchases: { ops_amount: number }[];
        ops_airdrops: { amount: number }[];
        ops_rewards: { amount: number }[];
      }) => {
        const cycleStartPrice = await getCurrentCycleStartPrice();
        return {
          id: nft.id,
          level: nft.starLevel,
          totalOPS: calculateTotalOPS(nft),
          userReleaseRatio: 0,
          platformLiquidityRatio: 10,
          platformBuybackRatio: 5,
          opsReleaseRatio: 15,
          cycleStartPrice
        };
      }));

      setReleaseNFTs(nfts);
    } catch (error) {
      console.error('Error fetching release NFTs:', error);
    }
  };

  const handleRelease = (nft: ReleaseNFT, calc: ReleaseCalculation) => {
    setSelectedNFT(nft);
    setCalculation(calc);
    setShowCalculation(true);
  };

  const handleBurn = async (nftId: string) => {
    try {
      if (selectedNFT && calculation) {
        const releaseData: NFTReleaseInsert = {
          wallet_address: walletAddress,
          transaction_hash: '',
          token_id: Number(selectedNFT.id),
          type: 'STAR',
          amount: selectedNFT.totalOPS,
          status: 'completed',
          metadata: {
            userReleaseRatio: selectedNFT.userReleaseRatio,
            platformLiquidityRatio: selectedNFT.platformLiquidityRatio,
            platformBuybackRatio: selectedNFT.platformBuybackRatio,
            opsReleaseRatio: selectedNFT.opsReleaseRatio,
            cycleStartPrice: selectedNFT.cycleStartPrice,
            calculation: calculation
          }
        };

        const { error: releaseError } = await supabaseAdmin
          .from('nft_releases')
          .insert(releaseData);

        if (releaseError) throw releaseError;

        const updateData: NFTUpdate = {
          status: 'BURNED',
          updated_at: new Date().toISOString()
        };

        const { error } = await supabaseAdmin
          .from('star_nfts')
          .update(updateData)
          .eq('id', nftId);

        if (error) throw error;
        
        setShowCalculation(false);
        fetchReleaseNFTs();
      }
    } catch (error) {
      console.error('Error burning NFT:', error);
    }
  };

  const getCurrentCycleStartPrice = async (): Promise<number> => {
    const { data, error } = await supabaseAdmin
      .from('ops_presale_stages')
      .select('price')
      .eq('stage', 1)
      .order('cycle', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    
    const presaleStage = data as unknown as PresaleStageRow;
    if (!presaleStage || typeof presaleStage.price !== 'number') {
      throw new Error('No price data found');
    }
    return presaleStage.price;
  };

  const calculateTotalOPS = (nft: any): number => {
    const presaleOPS = nft.ops_presale_purchases.reduce((sum: number, p: { ops_amount: number }) => 
      sum + p.ops_amount, 0);
    const airdropOPS = nft.ops_airdrops.reduce((sum: number, a: { amount: number }) => 
      sum + a.amount, 0);
    const rewardsOPS = nft.ops_rewards.reduce((sum: number, r: { amount: number }) => 
      sum + r.amount, 0);
    
    return presaleOPS + airdropOPS + rewardsOPS;
  };

  return (
    <div className="space-y-6">
      {/* Release NFTs 列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {releaseNFTs.map(nft => (
          <ReleaseNFTCard
            key={nft.id}
            nft={nft}
            onRelease={(calc) => handleRelease(nft, calc)}
            onBurn={() => handleBurn(nft.id)}
          />
        ))}
      </div>

      {/* 释放计算详情模态框 */}
      {showCalculation && calculation && selectedNFT && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-b from-purple-900/30 to-black/30 rounded-xl backdrop-blur-sm border border-purple-500/20 w-full max-w-2xl"
          >
            <div className="p-6 border-b border-purple-500/20 flex justify-between items-center">
              <h3 className="text-xl font-bold">Release Calculation</h3>
              <button 
                onClick={() => setShowCalculation(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 用户获得部分 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-purple-400">User Receives</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-3 rounded">
                    <p className="text-xs text-gray-400">USDC Amount</p>
                    <p className="text-lg font-bold">${calculation.userUSDC.toFixed(2)}</p>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <p className="text-xs text-gray-400">OPS Amount</p>
                    <p className="text-lg font-bold">{calculation.userOPS.toFixed(2)} OPS</p>
                  </div>
                </div>
              </div>

              {/* 平台流动性部分 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-purple-400">Platform Liquidity</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-3 rounded">
                    <p className="text-xs text-gray-400">USDC Amount</p>
                    <p className="text-lg font-bold">${calculation.platformLiquidityUSDC.toFixed(2)}</p>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <p className="text-xs text-gray-400">OPS Amount</p>
                    <p className="text-lg font-bold">{calculation.platformLiquidityOPS.toFixed(2)} OPS</p>
                  </div>
                </div>
              </div>

              {/* 其他信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded">
                  <p className="text-xs text-gray-400">Platform Buyback</p>
                  <p className="text-lg font-bold">${calculation.platformBuybackUSDC.toFixed(2)}</p>
                </div>
                <div className="bg-black/20 p-3 rounded">
                  <p className="text-xs text-gray-400">OPS Release</p>
                  <p className="text-lg font-bold">{calculation.opsRelease.toFixed(2)} OPS</p>
                </div>
              </div>

              {/* 确认按钮 */}
              <button
                onClick={() => handleBurn(selectedNFT.id)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Confirm Release
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 空状态 */}
      {releaseNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No NFTs available for release</p>
        </div>
      )}
    </div>
  );
} 
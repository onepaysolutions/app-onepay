import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface CycleConfig {
  cycle_id: number;
  cycle_initial_p: number;
  cycle_end_p: number;
  next_cycle_p: number;
  cycle_total_Stages: number;
  cycle_total: number;
}

interface NFTLevel {
  id: number;
  presaleValue: number;
  contractValue: number;
}

const CYCLE_CONFIG: CycleConfig[] = [
  { cycle_id: 1, cycle_initial_p: 0.30, cycle_end_p: 0.50, next_cycle_p: 0.32, cycle_total_Stages: 20, cycle_total: 2000000 },
  { cycle_id: 2, cycle_initial_p: 0.32, cycle_end_p: 0.52, next_cycle_p: 0.34, cycle_total_Stages: 20, cycle_total: 2000000 },
  { cycle_id: 3, cycle_initial_p: 0.34, cycle_end_p: 0.54, next_cycle_p: 0.36, cycle_total_Stages: 20, cycle_total: 2000000 },
  { cycle_id: 4, cycle_initial_p: 0.36, cycle_end_p: 0.56, next_cycle_p: 0.40, cycle_total_Stages: 20, cycle_total: 2000000 },
  { cycle_id: 5, cycle_initial_p: 0.40, cycle_end_p: 0.60, next_cycle_p: 0.44, cycle_total_Stages: 20, cycle_total: 3100000 },
  { cycle_id: 6, cycle_initial_p: 0.44, cycle_end_p: 0.64, next_cycle_p: 0.48, cycle_total_Stages: 20, cycle_total: 3100000 }
];

const NFT_LEVELS: NFTLevel[] = [
  { id: 1, presaleValue: 250, contractValue: 500 },
  { id: 2, presaleValue: 550, contractValue: 1100 },
  { id: 3, presaleValue: 1800, contractValue: 3600 },
  { id: 4, presaleValue: 4550, contractValue: 9100 }
];

export function AirdropCalculator() {
  const { t } = useTranslation();
  const [selectedCycle, setSelectedCycle] = useState<number>(1);
  const [currentPrice, setCurrentPrice] = useState<number>(0.3);
  const [selectedNFTLevel, setSelectedNFTLevel] = useState<number>(1);
  const [airdropResults, setAirdropResults] = useState<{
    opsAmount: number;
    airdrops: { round: number; amount: number; value: number; totalAfterAirdrop: number; price: number; cycle: number }[];
    finalTotalAmount: number;
  } | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // 当选择周期时更新价格范围
  useEffect(() => {
    const cycle = CYCLE_CONFIG.find(c => c.cycle_id === selectedCycle);
    if (cycle) {
      setCurrentPrice(cycle.cycle_initial_p);
    }
  }, [selectedCycle]);

  // 计算空投结果
  const calculateAirdrops = () => {
    const currentCycleConfig = CYCLE_CONFIG.find(c => c.cycle_id === selectedCycle);
    const nftLevel = NFT_LEVELS[selectedNFTLevel - 1];
    
    if (!currentCycleConfig || !nftLevel) return;

    // 计算初始可以购买的 OPS 数量（取整）
    const initialOpsAmount = Math.floor(Math.abs(nftLevel.presaleValue / currentPrice));
    let currentAmount = initialOpsAmount;
    const airdrops = [];

    // 计算五次空投
    for (let i = 0; i < 5; i++) {
      // 计算空投数量（取整）
      const airdropAmount = Math.floor(Math.abs(currentAmount * 0.5));
      
      // 计算价格增长：前3轮每轮+0.02，后2轮每轮+0.04
      let airdropPrice;
      if (i < 3) {
        // Round 1-3: 每轮+0.02
        airdropPrice = currentPrice + (0.02 * (i + 1));
      } else {
        // Round 4-5: 每轮+0.04
        const baseIncrease = 0.02 * 3; // 前3轮的总增长
        const laterIncrease = 0.04 * (i - 2); // 后续轮次的增长
        airdropPrice = currentPrice + baseIncrease + laterIncrease;
      }
      
      // 更新累积总量（取整）
      currentAmount = Math.floor(Math.abs(currentAmount + airdropAmount));
      
      // 计算价值（保留小数）
      const value = airdropAmount * airdropPrice;
      
      airdrops.push({
        round: i + 1,
        amount: airdropAmount,
        value: value,
        totalAfterAirdrop: currentAmount,
        price: airdropPrice,
        cycle: selectedCycle
      });
    }

    setAirdropResults({ 
      opsAmount: initialOpsAmount, 
      airdrops,
      finalTotalAmount: currentAmount
    });
  };

  // 修改价格输入的验证
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cycle = CYCLE_CONFIG.find(c => c.cycle_id === selectedCycle);
    if (cycle) {
      const newPrice = Number(e.target.value);
      const minPrice = cycle.cycle_initial_p;
      const maxPrice = cycle.cycle_end_p;
      if (newPrice >= minPrice && newPrice <= maxPrice) {
        setCurrentPrice(newPrice);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-900/30 to-black/30 rounded-xl p-6 border border-purple-500/20">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {t("Airdrop Calculator")}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 周期选择 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2" id="cycle-select-label">
            {t("Select Cycle")}
          </label>
          <select
            aria-labelledby="cycle-select-label"
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(Number(e.target.value))}
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white"
          >
            {CYCLE_CONFIG.map(cycle => (
              <option key={cycle.cycle_id} value={cycle.cycle_id}>
                Cycle {cycle.cycle_id} (${cycle.cycle_initial_p.toFixed(2)} - ${cycle.cycle_end_p.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* 价格输入 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2" htmlFor="current-price">
            {t("Current Price (USDT)")}
          </label>
          <input
            id="current-price"
            type="number"
            value={currentPrice}
            onChange={handlePriceChange}
            step="0.01"
            min={CYCLE_CONFIG.find(c => c.cycle_id === selectedCycle)?.cycle_initial_p}
            max={CYCLE_CONFIG.find(c => c.cycle_id === selectedCycle)?.cycle_end_p}
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-2 text-white"
            aria-label={t("Current Price (USDT)")}
            placeholder={t("Enter current price")}
          />
        </div>
      </div>

      {/* NFT等级选择 */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">
          {t("Star NFT Level")}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {NFT_LEVELS.map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedNFTLevel(level.id)}
              className={`p-2 rounded-lg text-center transition-colors ${
                selectedNFTLevel === level.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
              }`}
            >
              Star {level.id}
              <div className="text-xs mt-1 opacity-75">
                ${level.presaleValue}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 计算按钮 */}
      <button
        onClick={calculateAirdrops}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors mb-6"
      >
        {t("Calculate Airdrops")}
      </button>

      {/* 算结果 */}
      {airdropResults && (
        <div className="space-y-4">
          {/* 初始购买信息 */}
          <div className="bg-purple-900/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">{t("Initial Purchase")}</p>
              <p className="text-sm text-gray-400">@ ${currentPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">{Math.floor(airdropResults.opsAmount).toLocaleString()} OPS</p>
              <p className="text-lg font-bold">
                ${(airdropResults.opsAmount * currentPrice).toFixed(2)}
              </p>
            </div>
          </div>

          {/* 空投列表 */}
          <div className="space-y-3">
            {airdropResults.airdrops.map((airdrop, index) => (
              <div key={index} className="bg-purple-900/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-400">{t("Airdrop Round")} {airdrop.round}</p>
                    <p className="text-xs text-gray-500">Cycle {airdrop.cycle}</p>
                  </div>
                  <p className="text-sm text-gray-400">@ ${airdrop.price.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-lg font-bold text-green-400">
                      +{Math.floor(airdrop.amount).toLocaleString()} OPS
                    </p>
                    <p className="text-sm text-purple-400">
                      Total: {Math.floor(airdrop.totalAfterAirdrop).toLocaleString()} OPS
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    ${airdrop.value.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 总计 */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">{t("Final OPS Amount")}</p>
                <p className="text-xl font-bold text-purple-400">
                  {Math.floor(airdropResults.finalTotalAmount).toLocaleString()} OPS
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{t("Total Value")}</p>
                <p className="text-xl font-bold">
                  ${(airdropResults.airdrops.reduce((sum, airdrop) => sum + airdrop.value, 0) + 
                    airdropResults.opsAmount * currentPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';
import OPEbuyback from '@/assets/images/OPEbuyback.png';
import OPEops from '@/assets/images/1000opss.png';
import USDT from '@/assets/images/1000USDT.svg';
import { useState, useEffect } from 'react';
import { FlowingLiquidityChart } from '../charts/FlowingLiquidityChart';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';
import { AnimatePresence, motion } from 'framer-motion';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { supabase } from '@/lib/supabase';
import { nftService } from "@/utils/supabase";

interface PriceData {
  period: number;
  price: number;
  supply: number;
  marketCap: number;
}

const priceData: PriceData[] = [
  { period: 1, price: 0.1, supply: 300000, marketCap: 30000 },
  { period: 2, price: 1.5, supply: 200000, marketCap: 300000 },
  { period: 3, price: 3.5, supply: 150000, marketCap: 525000 },
  { period: 4, price: 6.5, supply: 100000, marketCap: 650000 },
  { period: 5, price: 12.0, supply: 80000, marketCap: 960000 },
  { period: 6, price: 20.0, supply: 60000, marketCap: 1200000 },
  { period: 7, price: 35.0, supply: 40000, marketCap: 1400000 },
  { period: 8, price: 70.0, supply: 20000, marketCap: 1400000 }
];

const ALLOCATION_DATA = [
  { name: 'Operations', value: 30, color: '#7C3AED' },
  { name: 'Node', value: 10, color: '#8B5CF6' },
  { name: 'Planning & Risk Control', value: 10, color: '#6D28D9' },
  { name: 'Management', value: 10, color: '#5B21B6' },
  { name: 'Node Promotion', value: 10, color: '#4C1D95' },
  { name: 'Market Rewards', value: 10, color: '#6366F1' },
  { name: 'Liquidity Pool', value: 10, color: '#4F46E5' },
  { name: 'Technical Development', value: 10, color: '#4338CA' }
];

export function OPEChart() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'chart' | 'buyback' | 'allocation'>('chart');
  const [showDetails, setShowDetails] = useState(false);
  const [totalUSDT, setTotalUSDT] = useState(0);


  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
          <p className="text-purple-400 font-semibold">{t("Period")} {label}</p>
          <p className="text-white">{t("Price")}: {payload[0].value} USDT</p>
          <p className="text-gray-300">{t("Supply")}: {
            payload[0].payload.supply.toLocaleString()
          } OPE</p>
          <p className="text-gray-300">{t("Market Cap")}: {
            payload[0].payload.marketCap.toLocaleString()
          } USDT</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-b from-purple-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
      {/* 标签切换 */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('chart')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'chart'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
          }`}
        >
          {t("Price Chart")}
        </button>
        <button
          onClick={() => setActiveTab('allocation')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'allocation'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
          }`}
        >
          {t("Token Allocation")}
        </button>
        <button
          onClick={() => setActiveTab('buyback')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'buyback'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
          }`}
        >
          {t("Buyback Mechanism")}
        </button>
      </div>

      {activeTab === 'chart' ? (
        <>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            {t("ope.chart.prediction")}
          </h2>

          <div className="h-[400px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(139, 92, 246, 0.1)" 
                  vertical={false}  // 只显示水平网格线
                />
                
                <XAxis 
                  dataKey="period" 
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#4B5563' }}
                  tickLine={{ stroke: '#4B5563' }}
                />
                
                <YAxis
                  stroke="#9CA3AF"
                  domain={[0, 80]}
                  ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
                  axisLine={{ stroke: '#4B5563' }}
                  tickLine={{ stroke: '#4B5563' }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
                
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{
                    stroke: '#8B5CF6',
                    strokeWidth: 2,
                    r: 4,
                    fill: '#1F2937'
                  }}
                  activeDot={{
                    stroke: '#8B5CF6',
                    strokeWidth: 3,
                    r: 6,
                    fill: '#1F2937'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 重叠图片布局 */}
          <div className="relative h-32 mb-4">
            <img 
              src={USDT} 
              alt="1000 USDT"
              className="absolute left-1/2 -translate-x-[45%] h-full object-contain z-10"
            />
            <img 
              src={OPEops} 
              alt="1000 OPS"
              className="absolute left-1/2 -translate-x-[55%] h-full object-contain z-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">{t("Initial Price")}</p>
              <p className="text-xl font-bold text-purple-400">0.1 USDT</p>
            </div>
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">{t("Projected Price")}</p>
              <p className="text-xl font-bold text-purple-400">6.5 USDT</p>
            </div>
          </div>
        </>
      ) : activeTab === 'allocation' ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            {t("OPE Token Allocation")}
          </h2>

          <div className="h-[400px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ALLOCATION_DATA}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={450}
                  labelLine={false}
                  label={({ name, value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#9CA3AF"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-sm"
                      >
                        {`${name} ${value}%`}
                      </text>
                    );
                  }}
                  outerRadius={140}
                  innerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ALLOCATION_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="rgba(139, 92, 246, 0.1)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ALLOCATION_DATA.map((item) => (
              <div 
                key={item.name}
                className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20 hover:bg-purple-900/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-sm text-gray-300">{t(item.name)}</p>
                </div>
                <p className="text-xl font-bold text-purple-400">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            {t("OPE Buyback Mechanism")}
          </h2>
          
          <FlowingLiquidityChart totalUSDT={totalUSDT} />

          <div className="relative">
            <img 
              src={OPEbuyback} 
              alt="OPE Buyback Mechanism"
              className="w-full rounded-xl border border-purple-500/20"
            />
            <div 
              className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-black/20"
            />
          </div>

          <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
            <h3 className="text-lg font-semibold mb-2 text-purple-400">
              {t("How it works")}
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• {t("5% of USDT sales revenue goes to OPE buyback")}</li>
              <li>• {t("Buyback increases OPE price floor")}</li>
              <li>• {t("Creates sustainable price growth")}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 
import { Chain } from '@thirdweb-dev/chains';

// 定义合约地址
export const CONTRACT_ADDRESSES = {
  STARNFT: process.env.NEXT_PUBLIC_STARNFT_CONTRACT_ADDRESS,
  OPS: process.env.NEXT_PUBLIC_OPS_CONTRACT_ADDRESS,
} as const;

// 定义链配置
export const CHAIN_CONFIG: Chain = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID), // 例如 56 表示 BSC
  rpc: [process.env.NEXT_PUBLIC_RPC_URL],
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  shortName: "BSC",
  slug: "bsc",
  testnet: false,
  chain: "BSC",
  name: "BNB Smart Chain"
}; 
import { Chain } from "thirdweb";

export const chain = {
  chainId: 10,
  rpc: ["https://mainnet.optimism.io"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  name: "Optimism",
  chain: "ETH",
  shortName: "oeth",
  slug: "optimism",
  testnet: false,
  icon: {
    url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png",
    width: 512,
    height: 512,
    format: "png",
  }
} as const;

// 导出单个 RPC URL 供其他地方使用
export const RPC_URL = chain.rpc[0];
// 导出链 ID
export const CHAIN_ID = chain.chainId;
import { Chain, Optimism } from "@thirdweb-dev/chains";
import { createThirdwebClient } from "thirdweb";
import { avalancheFuji, base, bsc, ethereum, polygon } from "thirdweb/chains";
import { inAppWallet, createWallet } from "thirdweb/wallets";

// 默认链配置
export const defaultChain = Optimism;

// 创建 ThirdWeb 客户端
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

// Provider 配置
export const providerConfig = {
  client,
  activeChain: defaultChain,
  supportedChains: [
    Optimism,
    bsc,
    ethereum,
    avalancheFuji,
    base,
    polygon,
  ],
  supportedWallets: [
    inAppWallet({
      auth: {
        options: [
          "google",
          "apple",
          "facebook",
          "email",
          "phone",
          "passkey",
        ],
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
  ],
  dAppMeta: {
    name: "OnePay",
    description: "OnePay Web3 Payment Solution",
    logoUrl: "/logo.png",
    url: window.location.origin,
  },
  // 连接按钮配置
  connectButton: {
    theme: "dark",
    size: "md",
  },
  // 连接模态框配置
  connectModal: {
    theme: "dark",
    size: "compact",
    showThirdwebBranding: false,
  }
};

// 工具函数
export const thirdwebUtils = {
  // 检查链是否支持
  isSupportedChain: (chainId: number) => {
    return providerConfig.supportedChains.some((chain: any) => chain.chainId === chainId);
  },
  
  // 获取链配置
  getChainConfig: (chainId: number) => {
    return providerConfig.supportedChains.find((chain: any) => chain.chainId === chainId);
  },
  
  // 格式化链名称
  formatChainName: (chainId: number) => {
    const chain = providerConfig.supportedChains.find((chain: any) => chain.chainId === chainId);
    return chain ? chain.name : 'Unknown Chain';
  }
};

export const supportedChains = providerConfig.supportedChains;
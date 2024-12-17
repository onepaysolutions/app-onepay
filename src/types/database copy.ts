  // 客户端账户类型
  export interface Client {
    id: string;
    email: string;
    verified: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    createdAt: string;
    updatedAt: string;
    users: User[];
  }
  
  // 用户类型
  export interface User {
    id: string;
    clientId?: string;
    referralCode: string;
    referredBy?: string;
    nickname?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    
    // 关联
    client?: Client;
    wallets: Wallet[];
    referrals: ReferralRelation[];
    starReferrals: StarNFTReferral[];
  }
  
  // 钱包类型
  export interface Wallet {
    id: string;
    address: string;
    userId: string;
    isPrimary: boolean;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
    
    // 关联
    user: User;
    angelNFTs: AngelNFT[];
    starNFTs: StarNFT[];
  }
  
  // 基础推荐关系
  export interface ReferralRelation {
    id: string;
    referrerId: string;
    refereeId: string;
    level: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    
    // 关��
    referrer: User;
    referee: User;
  }
  
  // NFT 基础接口
  interface BaseNFT {
    id: string;
    tokenId: number;
    ownerAddress: string;
    status: 'ACTIVE' | 'INACTIVE' | 'BURNED';
    createdAt: string;
    updatedAt: string;
    
    // 关联
    owner: Wallet;
  }
  
  // Angel NFT
  export interface AngelNFT extends BaseNFT {
    type: 'ANGEL';
    level: number;
    power: number;
  }
  
  // Star NFT
  export interface StarNFT extends BaseNFT {
    type: 'STAR';
    starLevel: number;
    contractValue: string; // Decimal as string
    opsHolding: string;   // Decimal as string
    opsRewards: string;   // Decimal as string
    currentValue: string; // Decimal as string
    burnStatus: 'NONE' | 'PARTIAL' | 'COMPLETE';
    releaseRate: string;  // Decimal as string
    referrals: StarNFTReferral[];
  }
  
  // Star NFT 推荐关系
  export interface StarNFTReferral {
    id: string;
    starNftId: string;
    referrerId: string;
    refereeId: string;
    level: number;
    status: 'ACTIVE' | 'INACTIVE';
    rewardRate: string;   // Decimal as string
    createdAt: string;
    
    // 关联
    starNFT: StarNFT;
    referrer: User;
    referee: User;
  }
  
  // Star NFT 等级配置
  export interface StarNFTLevel {
    id: number;
    nameKey: string;
    price: string;        // Decimal as string
    returnRate: string;   // Decimal as string
    opsHolding: string;   // Decimal as string
    ownLevels: number;
    benefitsKey: string;
  }
  
  // OPS 预售配置
  export interface OPSPresale {
    id: string;
    cycle: number;
    stage: number;
    currentPrice: string; // Decimal as string
    nextPrice: string;    // Decimal as string
    soldAmount: string;   // Decimal as string
    stageAmount: string;  // Decimal as string
    totalStages: number;
    totalAmount: string;  // Decimal as string
    createdAt: string;
    updatedAt: string;
  }
  
  // NFT 数据配置
  export const NFT_DATA: StarNFTLevel[] = [
    {
      id: 0,
      nameKey: "starNFT.vipLevels.star1.name",
      price: "500",
      returnRate: "500",
      opsHolding: "1000",
      ownLevels: 3,
      benefitsKey: "starNFT.vipLevels.star1.benefits"
    },
    {
      id: 1,
      nameKey: "starNFT.vipLevels.star2.name",
      price: "1000",
      returnRate: "600",
      opsHolding: "2000",
      ownLevels: 8,
      benefitsKey: "starNFT.vipLevels.star2.benefits"
    },
    {
      id: 2,
      nameKey: "starNFT.vipLevels.star3.name",
      price: "3000",
      returnRate: "700",
      opsHolding: "5000",
      ownLevels: 15,
      benefitsKey: "starNFT.vipLevels.star3.benefits"
    },
    {
      id: 3,
      nameKey: "starNFT.vipLevels.star4.name",
      price: "7000",
      returnRate: "800",
      opsHolding: "10000",
      ownLevels: 20,
      benefitsKey: "starNFT.vipLevels.star4.benefits"
    }
  ];
  
  // 周期价格配置
  export const CYCLE_PRICES: Record<number, string> = {
    1: "0.30",
    2: "0.32",
    3: "0.34",
    4: "0.36"
  };
  
  // 预售配置
  export const OPS_PRESALE: Omit<OPSPresale, 'id' | 'createdAt' | 'updatedAt'> = {
    cycle: 1,
    stage: 1,
    currentPrice: "0.30",
    nextPrice: "0.31",
    soldAmount: "0",
    stageAmount: "100000",
    totalStages: 20,
    totalAmount: "2000000"
  }; 
  
  // Supabase 数据库类型定义
  export interface Database {
    public: {
      Tables: {
        // 客户端表
        clients: {
          Row: {
            id: string
            email: string
            passwordHash: string
            verified: boolean
            verifyToken: string | null
            status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
            createdAt: string
            updatedAt: string
          }
          Insert: {
            id?: string
            email: string
            passwordHash: string
            verified?: boolean
            verifyToken?: string | null
            status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
            createdAt?: string
            updatedAt?: string
          }
          Update: {
            email?: string
            passwordHash?: string
            verified?: boolean
            verifyToken?: string | null
            status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
            updatedAt?: string
          }
        }
        // 用户表
        users: {
          Row: {
            badge: string | string[];
            glory: number;
            avatar_url: string;
            name: string;
            wallet: string;
            created_at: string | number | Date;
            id: string
            clientId: string | null
            referralCode: string
            referrerCode: string | null
            nickname: string | null
            avatar: string | null
            isActivated: boolean
            createdAt: string
            updatedAt: string
          }
          Insert: {
            id?: string
            clientId?: string | null
            referralCode: string
            referrerCode?: string | null
            nickname?: string | null
            avatar?: string | null
            isActivated?: boolean
            createdAt?: string
            updatedAt?: string
          }
          Update: {
            clientId?: string | null
            referrerCode?: string | null
            nickname?: string | null
            avatar?: string | null
            isActivated?: boolean
            updatedAt?: string
          }
        }
        // 钱包表
        wallets: {
          Row: {
            id: string
            address: string
            userId: string
            isPrimary: boolean
            status: 'ACTIVE' | 'INACTIVE'
            createdAt: string
            updatedAt: string
          }
          Insert: {
            id?: string
            address: string
            userId: string
            isPrimary?: boolean
            status?: 'ACTIVE' | 'INACTIVE'
            createdAt?: string
            updatedAt?: string
          }
          Update: {
            isPrimary?: boolean
            status?: 'ACTIVE' | 'INACTIVE'
            updatedAt?: string
          }
        }
        // 推荐关系表
        referral_relations: {
          Row: {
            id: string
            referrerId: string
            refereeId: string
            level: number
            isActivated: boolean
            status: 'ACTIVE' | 'INACTIVE'
            createdAt: string
            updatedAt: string
          }
          Insert: {
            id?: string
            referrerId: string
            refereeId: string
            level: number
            isActivated?: boolean
            status?: 'ACTIVE' | 'INACTIVE'
            createdAt?: string
            updatedAt?: string
          }
          Update: {
            level?: number
            isActivated?: boolean
            status?: 'ACTIVE' | 'INACTIVE'
            updatedAt?: string
          }
        }
        // Angel NFT 表
        angel_nfts: {
          Row: {
            id: string
            tokenId: number
            ownerAddress: string
            type: 'ANGEL'
            level: number
            power: number
            status: 'ACTIVE' | 'INACTIVE' | 'BURNED'
            createdAt: string
            updatedAt: string
          }
          Insert: {
            id?: string
            tokenId: number
            ownerAddress: string
            type?: 'ANGEL'
            level: number
            power: number
            status?: 'ACTIVE' | 'INACTIVE' | 'BURNED'
            createdAt?: string
            updatedAt?: string
          }
          Update: {
            level?: number;
            power?: number;
            status?: 'ACTIVE' | 'INACTIVE' | 'BURNED';
            updated_at?: string;
          }
        }
        // Star NFT 表
        star_nfts: {
          Row: {
            id: string
            tokenId: number
            ownerAddress: string
            type: 'STAR'
            starLevel: number
            contractValue: string
            opsHolding: string
            opsRewards: string
            currentValue: string
            burnStatus: 'NONE' | 'PARTIAL' | 'COMPLETE'
            releaseRate: string
            status: 'ACTIVE' | 'INACTIVE' | 'BURNED'
            activatedAt: string | null
            createdAt: string
            updatedAt: string
          }
          Insert: {
            token_id: number;
            owner_address: string;
            star_level: number;
            contract_value?: string;
            ops_holding?: string;
            ops_rewards?: string;
            current_value?: string;
            release_rate?: string;
            status?: 'ACTIVE' | 'INACTIVE' | 'BURNED';
            created_at?: string;
            updated_at?: string;
          }
          Update: {
            star_level?: number;
            contract_value?: string;
            ops_holding?: string;
            ops_rewards?: string;
            current_value?: string;
            release_rate?: string;
            status?: 'ACTIVE' | 'INACTIVE' | 'BURNED';
            updated_at?: string;
          }
        }
        // Star NFT 推荐关系表
        star_nft_referrals: {
          Row: {
            id: string
            starNftId: string
            referrerId: string
            refereeId: string
            level: number
            status: 'ACTIVE' | 'INACTIVE'
            rewardRate: string
            activatedAt: string
            createdAt: string
          }
          Insert: {
            id?: string
            starNftId: string
            referrerId: string
            refereeId: string
            level: number
            status?: 'ACTIVE' | 'INACTIVE'
            rewardRate: string
            activatedAt?: string
            createdAt?: string
          }
          Update: {
            level?: number
            status?: 'ACTIVE' | 'INACTIVE'
            rewardRate?: string
          }
        }
        nft_transactions: {
          Row: {
            id: string
            wallet_address: string
            transaction_hash: string
            token_id: number
            type: 'ANGEL' | 'STAR'
            amount: number
            status: string
            metadata: any
            created_at: string
          }
          Insert: {
            id?: string
            wallet_address: string
            transaction_hash: string
            token_id: number
            type: 'ANGEL' | 'STAR'
            amount?: number
            status?: string
            metadata?: any
            created_at?: string
          }
          Update: {
            wallet_address?: string
            transaction_hash?: string
            token_id?: number
            type?: 'ANGEL' | 'STAR'
            amount?: number
            status?: string
            metadata?: any
            created_at?: string
          }
        }
        ops_presale_purchases: {
          Row: {
            price: any;
            id: string;
            ops_amount: number;
          };
          Insert: {
            id?: string;
            ops_amount: number;
          };
          Update: {
            ops_amount?: number;
          };
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        [_ in never]: never
      }
      Enums: {
        client_status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
        nft_status: 'ACTIVE' | 'INACTIVE' | 'BURNED'
        burn_status: 'NONE' | 'PARTIAL' | 'COMPLETE'
        status: 'ACTIVE' | 'INACTIVE'
        wallet_status: 'ACTIVE' | 'INACTIVE'
      }
    }
  }
  
  // 导出常量配置
  export * from './constants'; 
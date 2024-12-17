export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          walletaddress: string
          referreraddress: string | null
          placementarea: string | null
          isactive: boolean | null
          createdat: string | null
        }
        Insert: {
          id?: number
          walletaddress: string
          referreraddress?: string | null
          placementarea?: string | null
          isactive?: boolean | null
          createdat?: string | null
        }
        Update: {
          id?: number
          walletaddress?: string
          referreraddress?: string | null
          placementarea?: string | null
          isactive?: boolean | null
          createdat?: string | null
        }
      }
      starnftconfig: {
        Row: {
          id: number
          tokenid: number
          name: string
          price: number
          benefits: Json
          airdroprate: number
          opspresale: number
          opspresalevalue: number
          opebuyback: number
          opebuybackvalue: number | null
          contractvalue: number
          fundpoolvalue: number | null
          rewardvalue: number | null
          generation1reward: number | null
          generation2reward: number | null
          generation3reward: number | null
          maxtiers: number
        }
      }
      starnftclaim: {
        Row: {
          id: number
          userid: number
          tokenid: number
          walletaddress: string | null
          price: number | null
          opsamount: number | null
          opevalue: number | null
          presalevalue: number | null
          contractvalue: number | null
          fundpoolvalue: number | null
          opebuybackvalue: number | null
          rewardvalue: number | null
          status: string | null
          claimstatus: string | null
          claimdate: string | null
        }
      }
    }
    Views: {
      referral_tree_view: {
        Row: {
          userid: number | null
          useraddress: string | null
          parentaddress: string | null
          tier: number | null
          isactive: boolean | null
          memberstatus: string | null
        }
      }
      referralstatsbyarea: {
        Row: {
          referreraddress: string | null
          placementarea: string | null
          totalreferrals: number | null
          activereferrals: number | null
          inactivereferrals: number | null
        }
      }
    }
  }
}

// 导出常用类型
export type UserRow = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type StarNFTConfig = Database['public']['Tables']['starnftconfig']['Row']
export type StarNFTClaim = Database['public']['Tables']['starnftclaim']['Row']

export type ReferralTreeView = Database['public']['Views']['referral_tree_view']['Row']
export type ReferralStatsByArea = Database['public']['Views']['referralstatsbyarea']['Row']

// 推荐树节点类型
export interface ReferralNode {
  useraddress: string
  parentaddress: string | null
  tier: number
  path: string[]
  isactive: boolean
  memberstatus: string
  placementarea: string | null
  children: ReferralNode[]
}

// NFT 相关类型
export interface NFTMetadata {
  tokenId: number
  name: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string | number
  }[]
}

export interface ClaimCondition {
  price: number
  maxQuantity: number
  startTime: Date
  endTime?: Date
  currentMinted: number
}

// 奖励相关类型
export interface RewardDistribution {
  walletAddress: string
  rewardType: 'angel_nft_claim' | 'referral_bonus' | 'staking_reward'
  amount: string
  tokenAddress: string
  timestamp?: string
} 
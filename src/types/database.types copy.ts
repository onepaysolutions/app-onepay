import { NFTStatus } from "./nfts"

// 添加缺失的类型
export type NFTType = 'ANGEL' | 'STAR'
export type Zone = 'LEFT' | 'MIDDLE' | 'RIGHT'

export type Database = {
  public: {
    Tables: {
      // 现有运营相关表
      ops_presale_stages: {
        Row: {
          id: number
          cycleGroupId: number 
          cycleGroupNr: number
          cycleStage: number
          price: number
          totalAmount: number
          soldAmount: number
          status: string
          startTime: string | null
          endTime: string | null
          updatedAt: string
        }
        Insert: Omit<Tables['ops_presale_stages']['Row'], 'id'>
        Update: Partial<Tables['ops_presale_stages']['Row']>
      }
      tier_rewards: {
        Row: {
          id: number
          nft_id: number
          presale_id: number
          level: number
          amount: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['tier_rewards']['Row'], 'id'>
        Update: Partial<Tables['tier_rewards']['Row']>
      }
      pair_rewards: {
        Row: {
          id: number
          nft_id: number
          tier_reward_id: number
          generation: number
          amount: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['pair_rewards']['Row'], 'id'>
        Update: Partial<Tables['pair_rewards']['Row']>
      }
      // NFT 相关表
      angel_nfts: {
        Row: {
          id: string
          tokenId: number
          ownerAddress: string
          type: NFTType
          level: number
          power: number
          status: NFTStatus
          createdAt: string
          updatedAt: string
        }
        Insert: Omit<Tables['angel_nfts']['Row'], 'id'>
        Update: Partial<Tables['angel_nfts']['Row']>
      }
      star_nfts: {
        Row: {
          id: string
          tokenId: number
          ownerAddress: string
          type: NFTType
          starLevel: number
          contractValue: number
          activatedAt: string | null
          status: NFTStatus
          createdAt: string
          updatedAt: string
        }
        Insert: Omit<Tables['star_nfts']['Row'], 'id'>
        Update: Partial<Tables['star_nfts']['Row']>
      }
      // 用户和钱包相关表
      users: {
        Row: {
          id: string
          referralcode: string
          referrercode: string
          nickname: string
          avatar: string
          isactivated: boolean
          createdat: string
          updatedat: string
        }
        Insert: Omit<Tables['users']['Row'], 'id'>
        Update: Partial<Tables['users']['Row']>
      }
      wallets: {
        Row: {
          id: string
          walletaddress: string
          userid: string
          referrerwallet: string | null
          referralpath: string | null
          level: number | null
          placementarea: string | null
          createdat: string
          updatedat: string
          login_count: number
          last_login_at: string
        }
        Insert: Omit<Tables['wallets']['Row'], 'id'>
        Update: Partial<Tables['wallets']['Row']>
      }
    }
  }
}

export type Tables = Database['public']['Tables']
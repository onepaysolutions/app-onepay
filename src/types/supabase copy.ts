export type Database = {
  public: {
    Tables: {
      claims: {
        Row: {
          id: number
          user_id: string
          nft_id: string
          claimed_at: string
          // ... 其他字段
        }
        Insert: {
          user_id: string
          nft_id: string
          // ... 其他必要字段
        }
      }
      // ... 其他表
    }
  }
} 

// 用户状态枚举
export enum UserStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED'
}

// 钱包接口
export interface Wallet {
  id: string;
  walletaddress: string;
  userid?: string;
  referrerwallet?: string;
  referralpath?: string;
  placementarea?: string;
  level: number;
  createdat: Date;
  updatedat: Date;
}

// 用户接口
export interface User {
  id: string;
  nickname: string;
  email: string;
  status: UserStatus;
  referralcode?: string;
  referrercode?: string;
  avatar?: string;
  isactivated: boolean;
  createdat: Date;
  updatedat: Date;
  confirmation_token?: string;
  email_confirmed_at?: Date;
  recovery_token?: string;
  reauthentication_token?: string;
  is_anonymous?: boolean;
  is_super_admin?: boolean;
  banned_until?: Date;
  deleted_at?: Date;
  phone?: string;
  phone_confirmed_at?: Date;
  phone_change?: string;
  phone_change_sent_at?: Date;
  raw_app_meta_data?: any;
  raw_user_meta_data?: any;
  is_sso_user?: boolean;
  instance_id?: string;
  role?: string;
  encrypted_password?: string;
} 
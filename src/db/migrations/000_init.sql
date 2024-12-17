-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address VARCHAR NOT NULL UNIQUE,
  status VARCHAR DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建钱包表
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  address VARCHAR NOT NULL UNIQUE,
  is_primary BOOLEAN DEFAULT false,
  wallet_type VARCHAR,
  nonce VARCHAR,
  signature TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建推荐关系表
CREATE TABLE referral_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_address VARCHAR NOT NULL REFERENCES users(address),
  referee_address VARCHAR NOT NULL REFERENCES users(address),
  zone VARCHAR NOT NULL,  -- 'left', 'middle', 'right'
  parent_id UUID REFERENCES referral_relationships(id),
  level INTEGER NOT NULL DEFAULT 1,
  path_string TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referee_address)
);

-- 创建奖励分配表
CREATE TABLE reward_distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR NOT NULL REFERENCES users(address),
  amount NUMERIC NOT NULL,
  reward_type VARCHAR NOT NULL, -- 'angel_nft_claim', 'star_nft_claim', 'referral_reward'
  token_address VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending',
  transaction_hash VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 Angel NFT 表
CREATE TABLE angel_nfts (
  token_id BIGINT PRIMARY KEY,
  owner_address VARCHAR NOT NULL REFERENCES users(address),
  position VARCHAR NOT NULL, -- 'left', 'middle', 'right'
  transaction_hash VARCHAR,
  join_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 Star NFT 表
CREATE TABLE star_nfts (
  token_id BIGINT PRIMARY KEY,
  owner_address VARCHAR NOT NULL REFERENCES users(address),
  star_level INTEGER NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'active',
  activation_time TIMESTAMP WITH TIME ZONE,
  total_ops_bought NUMERIC DEFAULT 0,
  total_ops_rewarded NUMERIC DEFAULT 0,
  total_ops_airdropped NUMERIC DEFAULT 0,
  usd_value_cap NUMERIC NOT NULL,
  transaction_hash VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户区域统计表
CREATE TABLE user_zone_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR NOT NULL REFERENCES users(address),
  zone VARCHAR NOT NULL,  -- 'left', 'middle', 'right'
  personal_ops NUMERIC DEFAULT 0,  -- 个人业绩
  team_ops NUMERIC DEFAULT 0,      -- 团队业绩
  direct_members INTEGER DEFAULT 0, -- 直推成员数
  total_members INTEGER DEFAULT 0,  -- 总成员数
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, zone)
);

-- 创建 NFT claim 记录表
CREATE TABLE nft_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id INTEGER NOT NULL,
  owner_address VARCHAR NOT NULL REFERENCES users(address),
  nft_type VARCHAR NOT NULL, -- 'angel' or 'star'
  amount VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending',
  transaction_hash VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间戳触发器
CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_wallets_timestamp
  BEFORE UPDATE ON user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_referral_relationships_timestamp
  BEFORE UPDATE ON referral_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reward_distributions_timestamp
  BEFORE UPDATE ON reward_distributions
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_angel_nfts_timestamp
  BEFORE UPDATE ON angel_nfts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_star_nfts_timestamp
  BEFORE UPDATE ON star_nfts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_zone_stats_timestamp
  BEFORE UPDATE ON user_zone_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_nft_claims_timestamp
  BEFORE UPDATE ON nft_claims
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建索引
CREATE INDEX idx_users_address ON users(address);
CREATE INDEX idx_user_wallets_address ON user_wallets(address);
CREATE INDEX idx_referral_relationships_referrer ON referral_relationships(referrer_address);
CREATE INDEX idx_referral_relationships_referee ON referral_relationships(referee_address);
CREATE INDEX idx_reward_distributions_wallet ON reward_distributions(wallet_address);
CREATE INDEX idx_angel_nfts_owner ON angel_nfts(owner_address);
CREATE INDEX idx_star_nfts_owner ON star_nfts(owner_address);
CREATE INDEX idx_user_zone_stats_wallet ON user_zone_stats(wallet_address);
CREATE INDEX idx_nft_claims_owner ON nft_claims(owner_address); 
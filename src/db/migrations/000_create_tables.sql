-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address VARCHAR NOT NULL UNIQUE,
  status VARCHAR DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建钱包表
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  address VARCHAR NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  last_connected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建推荐关系表
CREATE TABLE IF NOT EXISTS referral_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_address VARCHAR NOT NULL REFERENCES users(address),
  referee_address VARCHAR NOT NULL REFERENCES users(address),
  zone VARCHAR DEFAULT 'left',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referee_address)
);

-- 创建奖励分配表
CREATE TABLE IF NOT EXISTS reward_distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount NUMERIC NOT NULL,
  reward_type VARCHAR NOT NULL,
  token_address VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 NFT 持有表
CREATE TABLE IF NOT EXISTS nft_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  token_id INTEGER NOT NULL,
  nft_type VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_users_address ON users(address);
CREATE INDEX IF NOT EXISTS idx_user_wallets_address ON user_wallets(address);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_referrer ON referral_relationships(referrer_address);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_referee ON referral_relationships(referee_address);
CREATE INDEX IF NOT EXISTS idx_reward_distributions_user ON reward_distributions(user_id);
CREATE INDEX IF NOT EXISTS idx_nft_holdings_user ON nft_holdings(user_id);

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 添加触发器
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

CREATE TRIGGER update_nft_holdings_timestamp
  BEFORE UPDATE ON nft_holdings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp(); 
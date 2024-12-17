-- 创建用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address VARCHAR NOT NULL UNIQUE,  -- 钱包地址
  status VARCHAR DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建钱包表
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  address VARCHAR NOT NULL,  -- 钱包地址
  is_primary BOOLEAN DEFAULT false,
  last_connected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建推荐关系表
CREATE TABLE referral_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_address VARCHAR NOT NULL REFERENCES users(address),
  referee_address VARCHAR NOT NULL REFERENCES users(address),
  zone VARCHAR DEFAULT 'left',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referee_address)  -- 每个用户只能被推荐一次
);

-- 创建奖励分配表
CREATE TABLE reward_distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount NUMERIC NOT NULL,
  reward_type VARCHAR NOT NULL,
  token_address VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 NFT 持有表
CREATE TABLE nft_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  token_id INTEGER NOT NULL,
  nft_type VARCHAR NOT NULL,  -- 'angel' 或 'star'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
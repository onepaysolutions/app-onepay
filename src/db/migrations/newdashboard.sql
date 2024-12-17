-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 用户基础表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 用户钱包表
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  address TEXT NOT NULL UNIQUE,
  is_primary BOOLEAN DEFAULT false,
  type TEXT,
  nonce TEXT,
  signature TEXT,
  verified_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 添加触发器
CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_wallets_timestamp
  BEFORE UPDATE ON wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建索引
CREATE INDEX idx_users_wallet ON users(wallet);
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_wallets_user ON wallets(user_id);

-- 推荐关系表
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id),
  referee_id UUID REFERENCES users(id),
  zone TEXT NOT NULL CHECK (zone IN ('left', 'middle', 'right')),
  level INTEGER NOT NULL DEFAULT 1,
  path_string TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(referee_id)
);

-- 推荐统计表
CREATE TABLE referral_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  zone TEXT NOT NULL,
  direct_count INTEGER DEFAULT 0,
  team_count INTEGER DEFAULT 0,
  direct_volume DECIMAL DEFAULT 0,
  team_volume DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 添加触发器
CREATE TRIGGER update_referrals_timestamp
  BEFORE UPDATE ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_referral_stats_timestamp
  BEFORE UPDATE ON referral_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建索引
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referee ON referrals(referee_id);
CREATE INDEX idx_referrals_zone ON referrals(zone);
CREATE INDEX idx_referral_stats_user_zone ON referral_stats(user_id, zone);

-- Star NFT表
CREATE TABLE star_nfts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id INTEGER NOT NULL UNIQUE,
  owner_address TEXT NOT NULL REFERENCES users(wallet),
  star_level INTEGER NOT NULL CHECK (star_level BETWEEN 1 AND 5),
  claimer_id UUID REFERENCES users(id),
  contact TEXT,
  badge TEXT,
  price NUMERIC(20,2) NOT NULL,
  reward NUMERIC(20,2) DEFAULT 0,
  total_released NUMERIC(20,2) DEFAULT 0,
  usd_value_cap NUMERIC(20,2) NOT NULL,
  transaction_hash TEXT,
  status TEXT DEFAULT 'active' CHECK (
    status IN ('active', 'inactive', 'burned', 'locked')
  ),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Star NFT释放记录
CREATE TABLE star_nft_releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id UUID REFERENCES star_nfts(id),
  release_amount NUMERIC(20,2) NOT NULL,
  usdc_amount NUMERIC(20,2) NOT NULL,
  transaction_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed')
  ),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 添加触发器
CREATE TRIGGER update_star_nfts_timestamp
  BEFORE UPDATE ON star_nfts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建索引
CREATE INDEX idx_star_nfts_owner ON star_nfts(owner_address);
CREATE INDEX idx_star_nfts_token ON star_nfts(token_id);
CREATE INDEX idx_star_nfts_level ON star_nfts(star_level);
CREATE INDEX idx_star_releases_nft ON star_nft_releases(nft_id);

-- 奖励表
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (
    type IN ('referral', 'star_nft', 'ops', 'team', 'special')
  ),
  pending NUMERIC(20,2) DEFAULT 0,
  claimed NUMERIC(20,2) DEFAULT 0,
  rollup NUMERIC(20,2) DEFAULT 0,
  is_rollup BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 奖励分配记录
CREATE TABLE reward_distributions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL NOT NULL,
  status TEXT NOT NULL,
  reward_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 添加触发器
CREATE TRIGGER update_rewards_timestamp
  BEFORE UPDATE ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reward_distributions_timestamp
  BEFORE UPDATE ON reward_distributions
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建索引
CREATE INDEX idx_rewards_type ON rewards(type);
CREATE INDEX idx_reward_distributions_user ON reward_distributions(user_id);
CREATE INDEX idx_reward_distributions_reward ON reward_distributions(reward_id);

-- OPS周期表
CREATE TABLE ops_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle INTEGER NOT NULL UNIQUE,
  stage INTEGER NOT NULL,
  current_price NUMERIC(20,2) NOT NULL,
  next_price NUMERIC(20,2),
  sold_amount NUMERIC(20,2) DEFAULT 0,
  stage_amount NUMERIC(20,2) NOT NULL,
  total_stages INTEGER NOT NULL,
  total_amount NUMERIC(20,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'active', 'completed', 'cancelled')
  ),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- OPS购买记录
CREATE TABLE ops_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  cycle_id UUID REFERENCES ops_cycles(id),
  amount NUMERIC(20,2) NOT NULL,
  price NUMERIC(20,2) NOT NULL,
  total_cost NUMERIC(20,2) NOT NULL,
  transaction_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'completed', 'failed')
  ),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 添加触发器
CREATE TRIGGER update_ops_cycles_timestamp
  BEFORE UPDATE ON ops_cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建索引
CREATE INDEX idx_ops_cycles_status ON ops_cycles(status);
CREATE INDEX idx_ops_purchases_user ON ops_purchases(user_id);
CREATE INDEX idx_ops_purchases_cycle ON ops_purchases(cycle_id);

-- OPS周期表
CREATE TABLE ops_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle INTEGER NOT NULL UNIQUE,
  stage INTEGER NOT NULL,
  current_price NUMERIC(20,2) NOT NULL,
  next_price NUMERIC(20,2),
  sold_amount NUMERIC(20,2) DEFAULT 0,
  stage_amount NUMERIC(20,2) NOT NULL,
  total_stages INTEGER NOT NULL,
  total_amount NUMERIC(20,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'active', 'completed', 'cancelled')
  ),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- OPS购买记录
CREATE TABLE ops_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  cycle_id UUID REFERENCES ops_cycles(id),
  amount NUMERIC(20,2) NOT NULL,
  price NUMERIC(20,2) NOT NULL,
  total_cost NUMERIC(20,2) NOT NULL,
  transaction_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'completed', 'failed')
  ),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 添加触发器
CREATE TRIGGER update_ops_cycles_timestamp
  BEFORE UPDATE ON ops_cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建索引
CREATE INDEX idx_ops_cycles_status ON ops_cycles(status);
CREATE INDEX idx_ops_purchases_user ON ops_purchases(user_id);
CREATE INDEX idx_ops_purchases_cycle ON ops_purchases(cycle_id);

-- 获取团队结构
CREATE OR REPLACE FUNCTION get_team_structure(
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  referrer_id UUID,
  referee_id UUID,
  zone TEXT,
  level INTEGER,
  total_volume NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE team AS (
    -- 基础查询：直接推荐
    SELECT 
      r.id,
      r.referrer_id,
      r.referee_id,
      r.zone,
      r.level,
      COALESCE(SUM(op.total_cost), 0) as total_volume
    FROM referrals r
    LEFT JOIN ops_purchases op ON r.referee_id = op.user_id
    WHERE r.referrer_id = p_user_id
    GROUP BY r.id, r.referrer_id, r.referee_id, r.zone, r.level
    
    UNION ALL
    
    -- 递归查询：团队成员
    SELECT 
      r.id,
      r.referrer_id,
      r.referee_id,
      r.zone,
      r.level,
      COALESCE(SUM(op.total_cost), 0) as total_volume
    FROM referrals r
    JOIN team t ON r.referrer_id = t.referee_id
    LEFT JOIN ops_purchases op ON r.referee_id = op.user_id
    GROUP BY r.id, r.referrer_id, r.referee_id, r.zone, r.level
  )
  SELECT * FROM team;
END;
$$ LANGUAGE plpgsql;

-- 更新用户区域统计
CREATE OR REPLACE FUNCTION update_user_zone_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新直推和团队统计
  WITH stats AS (
    SELECT
      r.zone,
      COUNT(DISTINCT CASE WHEN r.level = 1 THEN r.referee_id END) as direct_count,
      COUNT(DISTINCT r.referee_id) as team_count,
      COALESCE(SUM(CASE WHEN r.level = 1 THEN op.total_cost END), 0) as direct_volume,
      COALESCE(SUM(op.total_cost), 0) as team_volume
    FROM referrals r
    LEFT JOIN ops_purchases op ON r.referee_id = op.user_id
    WHERE r.referrer_id = NEW.referrer_id
    GROUP BY r.zone
  )
  INSERT INTO referral_stats (
    user_id,
    zone,
    direct_count,
    team_count,
    direct_volume,
    team_volume
  )
  SELECT
    NEW.referrer_id,
    s.zone,
    s.direct_count,
    s.team_count,
    s.direct_volume,
    s.team_volume
  FROM stats s
  ON CONFLICT (user_id, zone) DO UPDATE
  SET
    direct_count = EXCLUDED.direct_count,
    team_count = EXCLUDED.team_count,
    direct_volume = EXCLUDED.direct_volume,
    team_volume = EXCLUDED.team_volume,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 添加触发器
CREATE TRIGGER trigger_update_zone_stats
  AFTER INSERT OR UPDATE ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_user_zone_stats();

-- 修改创建用户和推荐关系的存储过程
CREATE OR REPLACE FUNCTION create_user_with_referral(
  p_wallet TEXT,
  p_referrer_id UUID,
  p_zone TEXT
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_path_string TEXT;
BEGIN
  -- 创建新用户
  INSERT INTO users (wallet, status, parent_id)
  VALUES (p_wallet, 'active', p_referrer_id)
  RETURNING id INTO v_user_id;

  -- 获取推荐路径
  WITH RECURSIVE ancestors AS (
    SELECT id, parent_id
    FROM users
    WHERE id = p_referrer_id
    UNION ALL
    SELECT u.id, u.parent_id
    FROM users u
    INNER JOIN ancestors a ON u.id = a.parent_id
  )
  SELECT string_agg(id::text, '/' ORDER BY level DESC)
  INTO v_path_string
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) as level
    FROM ancestors
    UNION ALL
    SELECT v_user_id, (SELECT COUNT(*) + 1 FROM ancestors)
  ) sorted;

  -- 创建推荐关系
  INSERT INTO referrals (
    referrer_id,
    referee_id,
    zone,
    level,
    path_string
  )
  VALUES (
    p_referrer_id,
    v_user_id,
    p_zone,
    1,
    v_path_string
  );

  -- 更新推荐统计
  INSERT INTO referral_stats (
    user_id,
    zone,
    direct_count,
    team_count
  )
  VALUES (
    p_referrer_id,
    p_zone,
    1,
    1
  )
  ON CONFLICT (user_id, zone)
  DO UPDATE SET
    direct_count = referral_stats.direct_count + 1,
    team_count = referral_stats.team_count + 1;
END;
$$;
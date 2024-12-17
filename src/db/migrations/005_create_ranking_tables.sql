-- 创建区域业绩配置表
CREATE TABLE zone_performance_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rank_level INTEGER NOT NULL,
  min_team_ops NUMERIC NOT NULL,
  min_small_zone_ops NUMERIC NOT NULL,
  reward_rate NUMERIC NOT NULL,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 添加唯一约束确保每个等级只有一个配置
  UNIQUE(rank_level)
);

-- 创建用户团队统计表
CREATE TABLE user_team_stats (
  wallet_address VARCHAR NOT NULL REFERENCES users(address),
  zone VARCHAR NOT NULL,
  team_size BIGINT DEFAULT 0,
  direct_referrals BIGINT DEFAULT 0,
  max_depth INTEGER DEFAULT 0,
  personal_ops NUMERIC DEFAULT 0,
  team_ops NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 添加主键约束
  PRIMARY KEY (wallet_address, zone)
);

-- 创建用户排名表
CREATE TABLE user_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR NOT NULL REFERENCES users(address),
  rank_level INTEGER NOT NULL,
  total_team_ops NUMERIC NOT NULL,
  left_zone_ops NUMERIC NOT NULL,
  middle_zone_ops NUMERIC NOT NULL,
  right_zone_ops NUMERIC NOT NULL,
  smallest_zone_ops NUMERIC NOT NULL,
  snapshot_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_zone_configs_level ON zone_performance_configs(rank_level);
CREATE INDEX idx_team_stats_wallet ON user_team_stats(wallet_address);
CREATE INDEX idx_team_stats_zone ON user_team_stats(zone);
CREATE INDEX idx_rankings_wallet ON user_rankings(wallet_address);
CREATE INDEX idx_rankings_level ON user_rankings(rank_level);
CREATE INDEX idx_rankings_time ON user_rankings(snapshot_time);

-- 添加触发器
CREATE TRIGGER update_zone_configs_timestamp
  BEFORE UPDATE ON zone_performance_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_team_stats_timestamp
  BEFORE UPDATE ON user_team_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_rankings_timestamp
  BEFORE UPDATE ON user_rankings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建更新用户排名的函数
CREATE OR REPLACE FUNCTION update_user_ranking(
  p_wallet_address VARCHAR,
  p_snapshot_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS VOID AS $$
DECLARE
  v_total_ops NUMERIC;
  v_left_ops NUMERIC;
  v_middle_ops NUMERIC;
  v_right_ops NUMERIC;
  v_smallest_ops NUMERIC;
  v_rank_level INTEGER;
BEGIN
  -- 获取各区域业绩
  SELECT 
    COALESCE(SUM(team_ops), 0),
    COALESCE(MAX(CASE WHEN zone = 'left' THEN team_ops END), 0),
    COALESCE(MAX(CASE WHEN zone = 'middle' THEN team_ops END), 0),
    COALESCE(MAX(CASE WHEN zone = 'right' THEN team_ops END), 0)
  INTO v_total_ops, v_left_ops, v_middle_ops, v_right_ops
  FROM user_team_stats
  WHERE wallet_address = p_wallet_address;

  -- 计算最小区业绩
  v_smallest_ops := LEAST(v_left_ops, v_middle_ops, v_right_ops);

  -- 确定等级
  SELECT rank_level INTO v_rank_level
  FROM zone_performance_configs
  WHERE min_team_ops <= v_total_ops
    AND min_small_zone_ops <= v_smallest_ops
    AND status = 'active'
  ORDER BY rank_level DESC
  LIMIT 1;

  -- 如果没找到等级,默认为0
  IF v_rank_level IS NULL THEN
    v_rank_level := 0;
  END IF;

  -- 更新排名记录
  INSERT INTO user_rankings (
    wallet_address,
    rank_level,
    total_team_ops,
    left_zone_ops,
    middle_zone_ops,
    right_zone_ops,
    smallest_zone_ops,
    snapshot_time
  ) VALUES (
    p_wallet_address,
    v_rank_level,
    v_total_ops,
    v_left_ops,
    v_middle_ops,
    v_right_ops,
    v_smallest_ops,
    p_snapshot_time
  );
END;
$$ LANGUAGE plpgsql;

-- 创建更新团队统计的函数
CREATE OR REPLACE FUNCTION update_team_stats(
  p_wallet_address VARCHAR,
  p_zone VARCHAR
)
RETURNS VOID AS $$
DECLARE
  v_team_size BIGINT;
  v_direct_refs BIGINT;
  v_max_depth INTEGER;
  v_personal_ops NUMERIC;
  v_team_ops NUMERIC;
BEGIN
  -- 计算团队规模和最大深度
  WITH RECURSIVE team AS (
    -- 基础查询:直接推荐
    SELECT 
      referee_address,
      1 as depth
    FROM referral_relationships
    WHERE referrer_address = p_wallet_address
      AND zone = p_zone
    
    UNION ALL
    
    -- 递归查询:团队成员的推荐
    SELECT 
      r.referee_address,
      t.depth + 1
    FROM team t
    JOIN referral_relationships r ON t.referee_address = r.referrer_address
    WHERE r.zone = p_zone
  )
  SELECT 
    COUNT(*),
    MAX(depth)
  INTO v_team_size, v_max_depth
  FROM team;

  -- 计算直推人数
  SELECT COUNT(*)
  INTO v_direct_refs
  FROM referral_relationships
  WHERE referrer_address = p_wallet_address
    AND zone = p_zone;

  -- 计算个人业绩
  SELECT COALESCE(SUM(amount), 0)
  INTO v_personal_ops
  FROM reward_distributions
  WHERE user_id = p_wallet_address
    AND reward_type = 'ops_purchase';

  -- 计算团队业绩
  WITH RECURSIVE team_ops AS (
    -- 基础查询:直接推荐的业绩
    SELECT 
      r.referee_address,
      COALESCE(SUM(rd.amount), 0) as ops
    FROM referral_relationships r
    LEFT JOIN reward_distributions rd ON r.referee_address = rd.user_id
    WHERE r.referrer_address = p_wallet_address
      AND r.zone = p_zone
      AND rd.reward_type = 'ops_purchase'
    GROUP BY r.referee_address
    
    UNION ALL
    
    -- 递归查询:团队成员的业绩
    SELECT 
      r.referee_address,
      COALESCE(SUM(rd.amount), 0) as ops
    FROM team_ops t
    JOIN referral_relationships r ON t.referee_address = r.referrer_address
    LEFT JOIN reward_distributions rd ON r.referee_address = rd.user_id
    WHERE r.zone = p_zone
      AND rd.reward_type = 'ops_purchase'
    GROUP BY r.referee_address
  )
  SELECT COALESCE(SUM(ops), 0) + v_personal_ops
  INTO v_team_ops
  FROM team_ops;

  -- 更新统计数据
  INSERT INTO user_team_stats (
    wallet_address,
    zone,
    team_size,
    direct_referrals,
    max_depth,
    personal_ops,
    team_ops
  ) VALUES (
    p_wallet_address,
    p_zone,
    v_team_size,
    v_direct_refs,
    v_max_depth,
    v_personal_ops,
    v_team_ops
  )
  ON CONFLICT (wallet_address, zone) DO UPDATE
  SET
    team_size = EXCLUDED.team_size,
    direct_referrals = EXCLUDED.direct_referrals,
    max_depth = EXCLUDED.max_depth,
    personal_ops = EXCLUDED.personal_ops,
    team_ops = EXCLUDED.team_ops,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql; 
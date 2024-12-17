-- 创建用户区域统计表
CREATE TABLE IF NOT EXISTS user_zone_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR NOT NULL REFERENCES users(address),
  zone VARCHAR NOT NULL,  -- 'left', 'middle', 'right'
  personal_ops NUMERIC DEFAULT 0,  -- 个人业绩
  team_ops NUMERIC DEFAULT 0,      -- 团队业绩
  direct_members INTEGER DEFAULT 0, -- 直推成员数
  total_members INTEGER DEFAULT 0,  -- 总成员数
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 添加唯一约束确保每个钱包地址的每个区域只有一条记录
  UNIQUE(wallet_address, zone)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_zone_stats_wallet ON user_zone_stats(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_zone_stats_zone ON user_zone_stats(zone);

-- 创建更新时间戳触发器
CREATE TRIGGER update_user_zone_stats_timestamp
  BEFORE UPDATE ON user_zone_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建自动更新团队业绩的函数和触发器
CREATE OR REPLACE FUNCTION update_team_ops()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新团队业绩 = 个人业绩 + 所有下级的个人业绩总和
  WITH RECURSIVE team_tree AS (
    -- 基础查询：直接下级
    SELECT 
      r.referrer_address,
      r.referee_address,
      u.personal_ops,
      1 as level
    FROM referral_relationships r
    JOIN user_zone_stats u ON r.referee_address = u.wallet_address
    WHERE r.zone = NEW.zone
    
    UNION ALL
    
    -- 递归查询：下级的下级
    SELECT 
      t.referrer_address,
      r.referee_address,
      u.personal_ops,
      t.level + 1
    FROM team_tree t
    JOIN referral_relationships r ON t.referee_address = r.referrer_address
    JOIN user_zone_stats u ON r.referee_address = u.wallet_address
    WHERE r.zone = NEW.zone
  )
  -- 计算团队总业绩
  UPDATE user_zone_stats
  SET team_ops = (
    SELECT COALESCE(SUM(personal_ops), 0)
    FROM team_tree
    WHERE referrer_address = NEW.wallet_address
  ) + NEW.personal_ops
  WHERE wallet_address = NEW.wallet_address
  AND zone = NEW.zone;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_ops
  AFTER INSERT OR UPDATE OF personal_ops ON user_zone_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_team_ops();

-- 创建自动更新成员数的函数和触发器
CREATE OR REPLACE FUNCTION update_member_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- 更新直推成员数
  WITH direct_count AS (
    SELECT 
      referrer_address,
      COUNT(*) as count
    FROM referral_relationships
    WHERE zone = NEW.zone
    GROUP BY referrer_address
  )
  UPDATE user_zone_stats uz
  SET direct_members = COALESCE(dc.count, 0)
  FROM direct_count dc
  WHERE uz.wallet_address = dc.referrer_address
  AND uz.zone = NEW.zone;

  -- 更新总成员数
  WITH RECURSIVE team_count AS (
    -- 基础查询：直接下级
    SELECT 
      referrer_address,
      referee_address,
      1 as level
    FROM referral_relationships
    WHERE zone = NEW.zone
    
    UNION ALL
    
    -- 递归查询：下级的下级
    SELECT 
      t.referrer_address,
      r.referee_address,
      t.level + 1
    FROM team_count t
    JOIN referral_relationships r ON t.referee_address = r.referrer_address
    WHERE r.zone = NEW.zone
  )
  UPDATE user_zone_stats uz
  SET total_members = (
    SELECT COUNT(DISTINCT referee_address)
    FROM team_count
    WHERE referrer_address = uz.wallet_address
  )
  WHERE zone = NEW.zone;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_member_counts
  AFTER INSERT OR UPDATE ON referral_relationships
  FOR EACH ROW
  EXECUTE FUNCTION update_member_counts(); 
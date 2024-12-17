-- 创建奖励记录表
CREATE TABLE reward_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address VARCHAR NOT NULL REFERENCES users(address),
  amount NUMERIC NOT NULL,
  reward_type VARCHAR NOT NULL,  -- 'referral', 'star_nft', 'ops_purchase' 等
  source_type VARCHAR NOT NULL,  -- 'referral', 'nft', 'purchase' 等
  source_id UUID NOT NULL,       -- 关联的源记录ID
  status VARCHAR DEFAULT 'pending',
  tx_hash VARCHAR,               -- 交易哈希
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- 添加约束
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- 创建索引
CREATE INDEX idx_reward_records_wallet ON reward_records(wallet_address);
CREATE INDEX idx_reward_records_type ON reward_records(reward_type);
CREATE INDEX idx_reward_records_source ON reward_records(source_type, source_id);
CREATE INDEX idx_reward_records_status ON reward_records(status);
CREATE INDEX idx_reward_records_created ON reward_records(created_at);

-- 添加触发器
CREATE TRIGGER update_reward_records_timestamp
  BEFORE UPDATE ON reward_records
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 创建更新推荐关系表结构
ALTER TABLE referral_relationships
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES referral_relationships(id),
  ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS path_string TEXT NOT NULL;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_referral_relationships_parent ON referral_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_level ON referral_relationships(level);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_path ON referral_relationships(path_string);

-- 创建函数来生成路径字符串
CREATE OR REPLACE FUNCTION generate_referral_path()
RETURNS TRIGGER AS $$
DECLARE
  v_parent_path TEXT;
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path_string = NEW.id::TEXT;
  ELSE
    SELECT path_string INTO v_parent_path
    FROM referral_relationships
    WHERE id = NEW.parent_id;
    
    NEW.path_string = v_parent_path || '/' || NEW.id::TEXT;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器来自动生成路径
CREATE TRIGGER trigger_generate_referral_path
  BEFORE INSERT ON referral_relationships
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_path();

-- 创建函数来更新推荐层级
CREATE OR REPLACE FUNCTION update_referral_levels()
RETURNS TRIGGER AS $$
BEGIN
  WITH RECURSIVE ref_tree AS (
    -- 基础查询:直接推荐
    SELECT 
      id,
      referrer_wallet,
      referee_wallet,
      parent_id,
      1 as level
    FROM referral_relationships
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- 递归查询:下级推荐
    SELECT 
      r.id,
      r.referrer_wallet,
      r.referee_wallet,
      r.parent_id,
      t.level + 1
    FROM referral_relationships r
    JOIN ref_tree t ON r.parent_id = t.id
  )
  UPDATE referral_relationships r
  SET level = t.level
  FROM ref_tree t
  WHERE r.id = t.id;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器来自动更新层级
CREATE TRIGGER trigger_update_referral_levels
  AFTER INSERT OR UPDATE OF parent_id ON referral_relationships
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_referral_levels(); 
-- 更新 user_wallets 表结构
ALTER TABLE user_wallets
  -- 添加新列
  ADD COLUMN IF NOT EXISTS wallet_type VARCHAR,
  ADD COLUMN IF NOT EXISTS nonce VARCHAR,
  ADD COLUMN IF NOT EXISTS signature TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active';

-- 更新现有列的约束
ALTER TABLE user_wallets
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN wallet_address SET NOT NULL,
  ALTER COLUMN is_primary SET DEFAULT false;

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_user_wallets_type ON user_wallets(wallet_type);
CREATE INDEX IF NOT EXISTS idx_user_wallets_status ON user_wallets(status);

-- 添加唯一约束
ALTER TABLE user_wallets
  ADD CONSTRAINT user_wallets_wallet_address_unique UNIQUE (wallet_address);

-- 更新 API 函数
CREATE OR REPLACE FUNCTION get_user_wallets(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  wallet_address VARCHAR,
  is_primary BOOLEAN,
  wallet_type VARCHAR,
  status VARCHAR,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.user_id,
    w.wallet_address,
    w.is_primary,
    w.wallet_type,
    w.status,
    w.verified_at,
    w.created_at
  FROM user_wallets w
  WHERE w.user_id = p_user_id
  ORDER BY w.is_primary DESC, w.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 添加验证钱包函数
CREATE OR REPLACE FUNCTION verify_wallet(
  p_wallet_address VARCHAR,
  p_signature TEXT,
  p_nonce VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_wallets
  SET 
    signature = p_signature,
    nonce = p_nonce,
    verified_at = NOW(),
    status = 'verified'
  WHERE wallet_address = p_wallet_address
  AND status = 'active';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql; 
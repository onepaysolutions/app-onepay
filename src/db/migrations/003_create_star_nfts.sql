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
  release_start_time TIMESTAMP WITH TIME ZONE,
  release_end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_star_nfts_owner ON star_nfts(owner_address);
CREATE INDEX idx_star_nfts_level ON star_nfts(star_level);
CREATE INDEX idx_star_nfts_status ON star_nfts(status);

-- 添加触发器
CREATE TRIGGER update_star_nfts_timestamp
  BEFORE UPDATE ON star_nfts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp(); 
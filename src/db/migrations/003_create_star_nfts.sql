-- 创建 star_nfts 表
CREATE TABLE IF NOT EXISTS public.star_nfts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  presale_value NUMERIC(20,0) NOT NULL DEFAULT 0,
  contract_value NUMERIC(20,0) NOT NULL DEFAULT 0,
  max_tiers INTEGER NOT NULL DEFAULT 0,
  pair_tiers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建钱包地址索引
CREATE INDEX IF NOT EXISTS star_nfts_wallet_address_idx ON public.star_nfts(wallet_address);
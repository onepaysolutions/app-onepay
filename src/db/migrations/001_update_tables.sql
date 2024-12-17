-- 先检查列是否存在
DO $$ 
BEGIN
    -- 检查 users 表中是否存在 wallet_address 列
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'wallet_address'
    ) THEN
        -- 如果存在，则重命名
        ALTER TABLE users RENAME COLUMN wallet_address TO address;
    END IF;

    -- 检查 referral_relationships 表中是否存在相关列
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'referral_relationships' 
        AND column_name = 'referrer_wallet'
    ) THEN
        ALTER TABLE referral_relationships RENAME COLUMN referrer_wallet TO referrer_address;
        ALTER TABLE referral_relationships RENAME COLUMN referee_wallet TO referee_address;
    END IF;

    -- 检查 reward_distributions 表中是否存在相关列
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'reward_distributions' 
        AND column_name = 'wallet_address'
    ) THEN
        ALTER TABLE reward_distributions RENAME COLUMN wallet_address TO user_id;
    END IF;

END $$;

-- 确保所有必要的约束都存在
ALTER TABLE users 
    ALTER COLUMN address SET NOT NULL,
    ADD CONSTRAINT IF NOT EXISTS users_address_unique UNIQUE (address);

-- 更新或添加外键约束
ALTER TABLE user_wallets
    DROP CONSTRAINT IF EXISTS user_wallets_user_id_fkey,
    ADD CONSTRAINT user_wallets_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE referral_relationships
    DROP CONSTRAINT IF EXISTS referral_relationships_referrer_address_fkey,
    DROP CONSTRAINT IF EXISTS referral_relationships_referee_address_fkey,
    ADD CONSTRAINT referral_relationships_referrer_address_fkey 
        FOREIGN KEY (referrer_address) REFERENCES users(address),
    ADD CONSTRAINT referral_relationships_referee_address_fkey 
        FOREIGN KEY (referee_address) REFERENCES users(address);

ALTER TABLE reward_distributions
    DROP CONSTRAINT IF EXISTS reward_distributions_user_id_fkey,
    ADD CONSTRAINT reward_distributions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id);

-- 添加或更新索引
CREATE INDEX IF NOT EXISTS idx_users_address ON users(address);
CREATE INDEX IF NOT EXISTS idx_user_wallets_address ON user_wallets(address);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_referrer ON referral_relationships(referrer_address);
CREATE INDEX IF NOT EXISTS idx_referral_relationships_referee ON referral_relationships(referee_address);
CREATE INDEX IF NOT EXISTS idx_reward_distributions_user ON reward_distributions(user_id); 
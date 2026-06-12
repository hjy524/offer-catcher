-- ===========================================
-- Offer捕手 - Supabase 数据库表结构
-- ===========================================
-- 在 Supabase SQL Editor 中运行这段 SQL

-- 1. 用户数据表（每个用户一条记录，JSONB存储所有业务数据）
CREATE TABLE IF NOT EXISTS user_data (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  username TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 社区笔记表
CREATE TABLE IF NOT EXISTS community_notes (
  id BIGINT NOT NULL,
  author TEXT DEFAULT '',
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT '其他',
  cover TEXT DEFAULT '',
  date TEXT DEFAULT '',
  likes INTEGER DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 3. 索引
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_community_notes_date ON community_notes(date);

-- 4. 自动更新 updated_at 的函数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. 触发器
DROP TRIGGER IF EXISTS trg_user_data_updated ON user_data;
CREATE TRIGGER trg_user_data_updated
  BEFORE UPDATE ON user_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. 开启行级安全（RLS），允许公开读写（anon key 可访问）
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notes ENABLE ROW LEVEL SECURITY;

-- 7. 允许所有操作（Demo 阶段使用，生产环境需限制）
DROP POLICY IF EXISTS "Allow all on user_data" ON user_data;
CREATE POLICY "Allow all on user_data"
  ON user_data FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on community_notes" ON community_notes;
CREATE POLICY "Allow all on community_notes"
  ON community_notes FOR ALL
  USING (true)
  WITH CHECK (true);

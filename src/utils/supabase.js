import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// 检查是否真实配置（非占位符）
const IS_CONFIGURED = !!supabaseUrl && !!supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey !== 'your-anon-key'

// 创建 Supabase client，未配置时用 dummy
const _realClient = IS_CONFIGURED ? createClient(supabaseUrl, supabaseAnonKey) : null

/** Supabase 客户端：已配置→真实，未配置→静默返回空结果 */
export const supabase = {
  from(table) {
    if (_realClient) return _realClient.from(table)
    // Dummy 对象，所有链式调用静默成功
    return createDummyQuery()
  },
  get isReady() { return IS_CONFIGURED }
}

function createDummyQuery() {
  // 返回一个 thenable 对象，所有查询方法都返回自身
  const dummy = {
    then(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve) },
    catch() { return this },
    select() { return this },
    insert() { return this },
    upsert() { return this },
    update() { return this },
    delete() { return this },
    upsert() { return this },
    eq() { return this },
    neq() { return this },
    order() { return this },
    limit() { return this },
    single() { return this },
    maybeSingle() { return this },
    match() { return this },
    in() { return this },
    is() { return this },
    gte() { return this },
    lte() { return this },
    like() { return this },
    ilike() { return this },
    or() { return this },
    range() { return this },
    setHeader() { return this },
    auth: { signIn: () => Promise.resolve({ data: null, error: null }) }
  }
  return dummy
}

export const isSupabaseReady = IS_CONFIGURED

console.log('[Supabase] 状态:', IS_CONFIGURED ? '已配置 ✅' : '未配置，使用离线模式')

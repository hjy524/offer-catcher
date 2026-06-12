import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { hashPassword, verifyPassword } from '@/utils/crypto'
import {
  saveUserData as supabaseSaveAll, fetchUserData as supabaseFetchAll,
  saveCommunityNotes as supabaseSaveNotes,
  fetchCommunityNotes as supabaseFetchNotes,
  saveAuthUser, findAuthUser
} from '@/utils/supabaseStorage'

// ===========================================
// Store - 纯云端存储，无 localStorage
// ===========================================

const store = reactive({
  user: null,

  // 内存数据缓存（登录后从 Supabase 加载）
  _cache: {
    resumes: [],
    journals: [],
    myNotes: [],
    favorites: [],
    aiChat: [],
    diagnoseHistory: [],
    careerTags: null,
    likedNotes: [],
    likedArticles: [],
    profile: {}
  },

  get isLoggedIn() {
    return !!this.user
  }
})

// ===========================================
// 工具
// ===========================================

let _syncTimer = null
function debounceSync() {
  if (!store.user) return
  clearTimeout(_syncTimer)
  _syncTimer = setTimeout(() => {
    supabaseSaveAll(store.user.id, store.user.username, store._cache).catch(() => {})
  }, 500)
}

// 首次登录：从 Supabase 拉取全部数据到缓存
async function loadCacheFromSupabase(migrateFromLocal) {
  if (!store.user) return
  try {
    const remoteData = await supabaseFetchAll(store.user.id)
    if (remoteData && Object.keys(remoteData).length > 0) {
      // 有云端数据 → 直接用
      Object.assign(store._cache, {
        resumes: remoteData.resumes || [],
        journals: remoteData.journals || [],
        myNotes: remoteData.myNotes || [],
        favorites: remoteData.favorites || [],
        aiChat: remoteData.aiChat || [],
        diagnoseHistory: remoteData.diagnoseHistory || [],
        careerTags: remoteData.careerTags ?? null,
        likedNotes: remoteData.likedNotes || [],
        likedArticles: remoteData.likedArticles || [],
        profile: remoteData.profile || {}
      })
      if (remoteData.profile) Object.assign(store.user, remoteData.profile)
      console.log('✅ 从 Supabase 加载数据完成')
    } else if (migrateFromLocal) {
      // 无云端数据，尝试从 localStorage 迁移
      migrateLocalStorageToCache()
    }
  } catch (e) {
    console.warn('Supabase 加载失败:', e.message)
  }
}

// 从 localStorage 迁移旧数据到缓存（兼容旧用户）
function migrateLocalStorageToCache() {
  if (!store.user) return
  const uid = store.user.id
  const keys = {
    resumes: `offer_catcher_resumes_${uid}`,
    journals: `offer_catcher_journals_${uid}`,
    myNotes: `offer_catcher_my_notes_${uid}`,
    favorites: `offer_catcher_favorites_${uid}`,
    aiChat: `offer_catcher_ai_chat_${uid}`,
    diagnoseHistory: `offer_catcher_diagnose_history_${uid}`,
    careerTags: `offer_catcher_career_tags_${uid}`,
    likedNotes: `offer_catcher_liked_notes_${uid}`,
    likedArticles: `offer_catcher_liked_articles_${uid}`
  }
  const profileKey = `offer_catcher_profile_${uid}`
  let migrated = false

  for (const [field, localKey] of Object.entries(keys)) {
    try {
      const raw = localStorage.getItem(localKey)
      if (raw) {
        store._cache[field] = JSON.parse(raw)
        migrated = true
      }
    } catch {}
  }
  try {
    const profileRaw = localStorage.getItem(profileKey)
    if (profileRaw) { store._cache.profile = JSON.parse(profileRaw); migrated = true }
  } catch {}

  if (migrated) {
    debounceSync()
    console.log('✅ 已从 localStorage 迁移数据到云端')
  }
}

// ===========================================
// 认证
// ===========================================

async function register(username, password) {
  if (!username || !password) { ElMessage.warning('请输入用户名和密码'); return false }
  if (username.length < 3 || username.length > 20) { ElMessage.warning('用户名长度需在3-20位之间'); return false }
  if (/[^\w一-龥]/.test(username)) { ElMessage.warning('用户名仅支持中英文、数字和下划线'); return false }
  if (password.length < 4) { ElMessage.warning('密码长度至少4位'); return false }

  // 查 Supabase 是否已注册
  const existing = await findAuthUser(username)
  if (existing) { ElMessage.warning('该用户名已被注册，请换一个'); return false }

  // 创建用户
  const userId = Date.now().toString()
  const hashedPw = await hashPassword(password)
  const createdAt = new Date().toISOString()

  // 保存认证信息到 Supabase
  const saved = await saveAuthUser(username, userId, hashedPw)
  if (!saved) { ElMessage.error('注册失败，请检查网络'); return false }

  store._cache.profile = {}
  store.user = { username, id: userId, createdAt }
  // 首次同步到云端
  await supabaseSaveAll(userId, username, store._cache)

  ElMessage.success('注册成功！')
  return true
}

async function login(username, password) {
  if (!username || !password) { ElMessage.warning('请输入用户名和密码'); return false }

  // 先查 Supabase
  let remoteUser = await findAuthUser(username)

  // 如果 Supabase 没有，尝试从 localStorage 迁移旧账号
  if (!remoteUser) {
    const allUsers = JSON.parse(localStorage.getItem('offer_catcher_all_users') || '{}')
    const userId = allUsers[username]
    if (userId) {
      const passwords = JSON.parse(localStorage.getItem('offer_catcher_passwords') || '{}')
      const hashedPw = passwords[userId]
      if (hashedPw) {
        // 验证密码
        const valid = await verifyPassword(password, hashedPw)
        if (!valid) { ElMessage.error('密码错误'); return false }
        // 迁移到 Supabase
        const saved = await saveAuthUser(username, userId, hashedPw)
        if (saved) {
          remoteUser = { username, user_id: userId, password_hash: hashedPw }
          console.log('旧账号已迁移到 Supabase:', username)
        } else {
          ElMessage.error('账号迁移失败，请重试'); return false
        }
      } else {
        // 旧版无密码用户（兼容）
        remoteUser = { username, user_id: userId, password_hash: '' }
        saveAuthUser(username, userId, '').catch(() => {})
      }
    } else {
      // localStorage 也没有 → 真的不存在
      // 但也检查一下 user_data 表（可能在极早期注册）
      try {
        const { supabase } = await import('@/utils/supabase')
        const { data: legacyUser } = await supabase
          .from('user_data')
          .select('user_id, username')
          .eq('username', username)
          .maybeSingle()
        if (legacyUser) {
          remoteUser = { username, user_id: legacyUser.user_id, password_hash: '' }
        }
      } catch {}
    }
  }

  if (!remoteUser) {
    ElMessage.warning('用户不存在，请先注册')
    return false
  }

  // 验证密码（如果上面还没验证过）
  if (remoteUser.password_hash) {
    const valid = await verifyPassword(password, remoteUser.password_hash)
    if (!valid) { ElMessage.error('密码错误'); return false }
  }

  store.user = {
    username,
    id: remoteUser.user_id,
    createdAt: remoteUser.created_at || new Date().toISOString()
  }

  // 从 Supabase 加载数据（同时迁移旧 localStorage 数据）
  await loadCacheFromSupabase(true)

  ElMessage.success('登录成功！')
  return true
}

function logout() {
  store.user = null
  // 清空缓存
  Object.assign(store._cache, {
    resumes: [], journals: [], myNotes: [], favorites: [],
    aiChat: [], diagnoseHistory: [], careerTags: null,
    likedNotes: [], likedArticles: [], profile: {}
  })
  ElMessage.success('已退出登录')
}

async function initUser() {
  // 尝试恢复会话（仅缓存用户名，数据从 Supabase 加载）
  const stored = localStorage.getItem('offer_catcher_user')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed && parsed.username && parsed.id) {
        store.user = parsed
        await loadCacheFromSupabase(true)
        return
      }
    } catch {}
  }
  store.user = null
}

// ===========================================
// 数据读写（内存缓存 + Supabase 异步持久化）
// ===========================================

function saveToCache(field, value) {
  store._cache[field] = value
  debounceSync()
}

function loadFromCache(field, def) {
  return store._cache[field] !== undefined ? store._cache[field] : def
}

function saveAIChat(messages) { saveToCache('aiChat', messages) }
function loadAIChat() { return loadFromCache('aiChat', []) }

function saveJournals(journals) { saveToCache('journals', journals) }
function loadJournals() { return loadFromCache('journals', []) }

function saveMyNotes(notes) { saveToCache('myNotes', notes) }
function loadMyNotes() { return loadFromCache('myNotes', []) }

function saveFavorites(favorites) { saveToCache('favorites', favorites) }
function loadFavorites() { return loadFromCache('favorites', []) }

function saveResumes(resumes) { saveToCache('resumes', resumes) }
function loadResumes() { return loadFromCache('resumes', []) }

function saveCareerTags(tags) { saveToCache('careerTags', tags) }
function loadCareerTags() { return loadFromCache('careerTags', null) }

function saveProfile(profile) {
  if (!store.user) return
  saveToCache('profile', profile)
  Object.assign(store.user, profile)
  // 持久化 user 到 localStorage 仅为了恢复会话
  localStorage.setItem('offer_catcher_user', JSON.stringify(store.user))
}
function loadProfile() { return loadFromCache('profile', {}) }

function saveLikedNotes(notes) { saveToCache('likedNotes', notes) }
function loadLikedNotes() { return loadFromCache('likedNotes', []) }

async function saveCommunityNotes(notes) {
  store._cache.communityNotes = notes
  try { await supabaseSaveNotes(notes) } catch {}
}
function loadCommunityNotes() { return store._cache.communityNotes || [] }
async function refreshCommunityNotes() {
  try {
    const notes = await supabaseFetchNotes()
    if (notes) store._cache.communityNotes = notes
    return notes
  } catch { return null }
}

function saveDiagnoseHistory(history) { saveToCache('diagnoseHistory', history) }
function loadDiagnoseHistory() { return loadFromCache('diagnoseHistory', []) }

function saveLikedArticles(articles) { saveToCache('likedArticles', articles) }
function loadLikedArticles() { return loadFromCache('likedArticles', []) }

// ===========================================
// 挂载
// ===========================================
Object.assign(store, {
  register, login, logout, initUser,
  saveAIChat, loadAIChat,
  saveJournals, loadJournals,
  saveMyNotes, loadMyNotes,
  saveFavorites, loadFavorites,
  saveResumes, loadResumes,
  saveCareerTags, loadCareerTags,
  saveProfile, loadProfile,
  saveLikedNotes, loadLikedNotes,
  saveCommunityNotes, loadCommunityNotes,
  refreshCommunityNotes,
  saveDiagnoseHistory, loadDiagnoseHistory,
  saveLikedArticles, loadLikedArticles
})

export function useUserStore() { return store }

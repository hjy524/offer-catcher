import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { hashPassword, verifyPassword } from '@/utils/crypto'
import {
  saveUserField, loadUserField,
  fetchCommunityNotes as supabaseFetchNotes,
  saveCommunityNotes as supabaseSaveNotes
} from '@/utils/supabaseStorage'

// ===========================================
// Store - 用户名+密码认证，reactive 单一对象
// ===========================================

const store = reactive({
  user: null,

  get isLoggedIn() {
    return !!this.user
  }
})

// ===========================================
// localStorage 工具（同步层）
// ===========================================
const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('保存失败:', e)
  }
}

const mkKey = (prefix) => {
  if (!store.user) return null
  return `${prefix}_${store.user.id}`
}

// ===========================================
// Supabase 同步
// ===========================================

// 同步本地数据到 Supabase（写入后调用，异步无阻塞）
function scheduleSync(field, value) {
  if (!store.user) return
  const userId = store.user.id
  const username = store.user.username
  // 异步同步到 Supabase，不阻塞主流程
  setTimeout(() => {
    saveUserField(userId, username, field, value).catch(() => {})
  }, 0)
}

// 从 Supabase 加载数据到 localStorage（登录/初始化时调用）
async function loadFromSupabaseToLocal() {
  if (!store.user) return
  const userId = store.user.id
  const username = store.user.username

  try {
    const { fetchUserData } = await import('@/utils/supabaseStorage')
    const remoteData = await fetchUserData(userId)
    if (!remoteData) return

    // 字段映射：从 Supabase 加载到 localStorage
    const fields = {
      resumes: `offer_catcher_resumes_${userId}`,
      journals: `offer_catcher_journals_${userId}`,
      my_notes: `offer_catcher_my_notes_${userId}`,
      favorites: `offer_catcher_favorites_${userId}`,
      ai_chat: `offer_catcher_ai_chat_${userId}`,
      diagnose_history: `offer_catcher_diagnose_history_${userId}`,
      career_tags: `offer_catcher_career_tags_${userId}`,
      liked_notes: `offer_catcher_liked_notes_${userId}`,
      liked_articles: `offer_catcher_liked_articles_${userId}`
    }

    for (const [field, localKey] of Object.entries(fields)) {
      if (remoteData[field] !== undefined && remoteData[field] !== null) {
        const localData = loadFromStorage(localKey)
        // 只在本地没有数据时才用远程数据（本地优先）
        if (!localData || (Array.isArray(localData) && localData.length === 0)) {
          saveToStorage(localKey, remoteData[field])
        }
      }
    }

    // 同步 profile
    if (remoteData.profile) {
      const existingProfile = loadFromStorage(`offer_catcher_profile_${userId}`)
      if (!existingProfile) {
        saveToStorage(`offer_catcher_profile_${userId}`, remoteData.profile)
      }
    }

    console.log('✅ Supabase 数据同步完成')
  } catch (e) {
    console.warn('Supabase 同步失败（不影响使用）:', e)
  }
}

// ===========================================
// 认证方法
// ===========================================

// 注册（用户名必须唯一）
async function register(username, password) {
  if (!username || !password) {
    ElMessage.warning('请输入用户名和密码')
    return false
  }
  if (username.length < 3 || username.length > 20) {
    ElMessage.warning('用户名长度需在3-20位之间')
    return false
  }
  if (/[^\w一-龥]/.test(username)) {
    ElMessage.warning('用户名仅支持中英文、数字和下划线')
    return false
  }
  if (password.length < 4) {
    ElMessage.warning('密码长度至少4位')
    return false
  }

  // 检查用户名是否已存在（本地 + Supabase）
  const allUsers = loadFromStorage('offer_catcher_all_users') || {}
  if (allUsers[username]) {
    ElMessage.warning('该用户名已被注册，请换一个')
    return false
  }

  try {
    // 检查 Supabase 中是否已有该用户
    const { supabase } = await import('@/utils/supabase')
    const { data: existing } = await supabase
      .from('user_data')
      .select('id')
      .eq('username', username)
      .maybeSingle()
    if (existing) {
      ElMessage.warning('该用户名已被注册，请换一个')
      return false
    }
  } catch {}

  // 创建用户
  const userId = Date.now().toString()
  allUsers[username] = userId
  saveToStorage('offer_catcher_all_users', allUsers)

  // 哈希密码并存储
  const hashedPw = await hashPassword(password)
  const passwords = loadFromStorage('offer_catcher_passwords') || {}
  passwords[userId] = hashedPw
  saveToStorage('offer_catcher_passwords', passwords)

  // 保存用户数据（含注册时间）
  const usersData = loadFromStorage('offer_catcher_users_data') || {}
  usersData[userId] = { username, createdAt: new Date().toISOString() }
  saveToStorage('offer_catcher_users_data', usersData)

  // 设置用户并持久化登录
  const userData = {
    username,
    id: userId,
    createdAt: new Date().toISOString()
  }
  store.user = userData
  saveToStorage('offer_catcher_user', userData)

  // 同步到 Supabase
  scheduleSync('profile', {})

  ElMessage.success('注册成功！')
  return true
}

// 登录（验证密码）
async function login(username, password) {
  if (!username || !password) {
    ElMessage.warning('请输入用户名和密码')
    return false
  }

  // 查找用户
  const allUsers = loadFromStorage('offer_catcher_all_users') || {}
  const userId = allUsers[username]
  if (!userId) {
    ElMessage.warning('用户不存在，请先注册')
    return false
  }

  // 验证密码
  const passwords = loadFromStorage('offer_catcher_passwords') || {}
  const hashedPw = passwords[userId]
  if (!hashedPw) {
    // 旧用户没有密码（兼容）→ 允许直接登录
    store.user = { username, id: userId }
    saveToStorage('offer_catcher_user', store.user)
    ElMessage.success('登录成功！')
    loadFromSupabaseToLocal() // 异步同步
    return true
  }

  const valid = await verifyPassword(password, hashedPw)
  if (!valid) {
    ElMessage.error('密码错误')
    return false
  }

  // 登录成功
  const usersData = loadFromStorage('offer_catcher_users_data') || {}
  const userCreatedAt = usersData[userId]?.createdAt

  const userData = {
    username,
    id: userId,
    createdAt: userCreatedAt || new Date().toISOString()
  }
  const savedProfile = loadFromStorage(`offer_catcher_profile_${userId}`)
  if (savedProfile) Object.assign(userData, savedProfile)

  store.user = userData
  saveToStorage('offer_catcher_user', userData)
  ElMessage.success('登录成功！')

  // 从 Supabase 同步数据到本地
  loadFromSupabaseToLocal()

  return true
}

// 登出
function logout() {
  store.user = null
  localStorage.removeItem('offer_catcher_user')
  ElMessage.success('已退出登录')
}

// 初始化（恢复会话）
async function initUser() {
  const stored = loadFromStorage('offer_catcher_user')
  if (stored && stored.username && stored.id) {
    if (!stored.createdAt) {
      const usersData = loadFromStorage('offer_catcher_users_data') || {}
      stored.createdAt = usersData[stored.id]?.createdAt || null
    }
    store.user = stored
    // 异步从 Supabase 加载数据
    loadFromSupabaseToLocal()
  } else {
    store.user = null
  }
}

// ===========================================
// 数据读写方法（同步写入 localStorage + 异步同步到 Supabase）
// ===========================================
function saveAIChat(messages) {
  const key = mkKey('offer_catcher_ai_chat'); if (key) { saveToStorage(key, messages); scheduleSync('ai_chat', messages) }
}
function loadAIChat() { const key = mkKey('offer_catcher_ai_chat'); return key ? (loadFromStorage(key) || []) : [] }

function saveJournals(journals) {
  const key = mkKey('offer_catcher_journals'); if (key) { saveToStorage(key, journals); scheduleSync('journals', journals) }
}
function loadJournals() { const key = mkKey('offer_catcher_journals'); return key ? (loadFromStorage(key) || []) : [] }

function saveMyNotes(notes) {
  const key = mkKey('offer_catcher_my_notes'); if (key) { saveToStorage(key, notes); scheduleSync('my_notes', notes) }
}
function loadMyNotes() { const key = mkKey('offer_catcher_my_notes'); return key ? (loadFromStorage(key) || []) : [] }

function saveFavorites(favorites) {
  const key = mkKey('offer_catcher_favorites'); if (key) { saveToStorage(key, favorites); scheduleSync('favorites', favorites) }
}
function loadFavorites() { const key = mkKey('offer_catcher_favorites'); return key ? (loadFromStorage(key) || []) : [] }

function saveResumes(resumes) {
  const key = mkKey('offer_catcher_resumes'); if (key) { saveToStorage(key, resumes); scheduleSync('resumes', resumes) }
}
function loadResumes() { const key = mkKey('offer_catcher_resumes'); return key ? (loadFromStorage(key) || []) : [] }

function saveCareerTags(tags) {
  const key = mkKey('offer_catcher_career_tags'); if (key) { saveToStorage(key, tags); scheduleSync('career_tags', tags) }
}
function loadCareerTags() { const key = mkKey('offer_catcher_career_tags'); return key ? loadFromStorage(key) : null }

function saveProfile(profile) {
  if (!store.user) return
  saveToStorage(`offer_catcher_profile_${store.user.id}`, profile)
  Object.assign(store.user, profile)
  saveToStorage('offer_catcher_user', store.user)
  scheduleSync('profile', profile)
}
function loadProfile() {
  if (!store.user) return null
  return loadFromStorage(`offer_catcher_profile_${store.user.id}`)
}

function saveLikedNotes(likedNotes) {
  const key = mkKey('offer_catcher_liked_notes'); if (key) { saveToStorage(key, likedNotes); scheduleSync('liked_notes', likedNotes) }
}
function loadLikedNotes() { const key = mkKey('offer_catcher_liked_notes'); return key ? (loadFromStorage(key) || []) : [] }

// 社区笔记 - 直接使用 Supabase
async function saveCommunityNotes(notes) {
  saveToStorage('offer_catcher_community_notes', notes)
  try { await supabaseSaveNotes(notes) } catch {}
}
function loadCommunityNotes() {
  return loadFromStorage('offer_catcher_community_notes') || []
}
// 异步从 Supabase 加载社区笔记（在合适时机调用）
async function refreshCommunityNotes() {
  try {
    const notes = await supabaseFetchNotes()
    if (notes && notes.length > 0) {
      saveToStorage('offer_catcher_community_notes', notes)
    }
    return notes
  } catch { return null }
}

function saveDiagnoseHistory(history) {
  const key = mkKey('offer_catcher_diagnose_history'); if (key) { saveToStorage(key, history); scheduleSync('diagnose_history', history) }
}
function loadDiagnoseHistory() { const key = mkKey('offer_catcher_diagnose_history'); return key ? (loadFromStorage(key) || []) : [] }

function saveLikedArticles(likedArticles) {
  const key = mkKey('offer_catcher_liked_articles'); if (key) { saveToStorage(key, likedArticles); scheduleSync('liked_articles', likedArticles) }
}
function loadLikedArticles() { const key = mkKey('offer_catcher_liked_articles'); return key ? (loadFromStorage(key) || []) : [] }

// ===========================================
// 挂载方法到 store
// ===========================================
Object.assign(store, {
  register,
  login,
  logout,
  initUser,
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

export function useUserStore() {
  return store
}

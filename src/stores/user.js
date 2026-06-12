import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { hashPassword, verifyPassword } from '@/utils/crypto'

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
// localStorage 工具
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

  // 检查用户名是否已存在
  const allUsers = loadFromStorage('offer_catcher_all_users') || {}
  if (allUsers[username]) {
    ElMessage.warning('该用户名已被注册，请换一个')
    return false
  }

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
    // 旧用户没有密码（兼容）→ 允许直接登录，但要求设置密码
    // 对于已有数据的旧用户，直接放行
    store.user = { username, id: userId }
    saveToStorage('offer_catcher_user', store.user)
    ElMessage.success('登录成功！')
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
  return true
}

// 登出
function logout() {
  store.user = null
  localStorage.removeItem('offer_catcher_user')
  ElMessage.success('已退出登录')
}

// 初始化（恢复会话）
function initUser() {
  const stored = loadFromStorage('offer_catcher_user')
  if (stored && stored.username && stored.id) {
    // 确保 createdAt 存在
    if (!stored.createdAt) {
      const usersData = loadFromStorage('offer_catcher_users_data') || {}
      stored.createdAt = usersData[stored.id]?.createdAt || null
    }
    store.user = stored
  } else {
    store.user = null
  }
}

// ===========================================
// 数据读写方法
// ===========================================
function saveAIChat(messages) { const key = mkKey('offer_catcher_ai_chat'); if (key) saveToStorage(key, messages) }
function loadAIChat() { const key = mkKey('offer_catcher_ai_chat'); return key ? (loadFromStorage(key) || []) : [] }

function saveJournals(journals) { const key = mkKey('offer_catcher_journals'); if (key) saveToStorage(key, journals) }
function loadJournals() { const key = mkKey('offer_catcher_journals'); return key ? (loadFromStorage(key) || []) : [] }

function saveMyNotes(notes) { const key = mkKey('offer_catcher_my_notes'); if (key) saveToStorage(key, notes) }
function loadMyNotes() { const key = mkKey('offer_catcher_my_notes'); return key ? (loadFromStorage(key) || []) : [] }

function saveFavorites(favorites) { const key = mkKey('offer_catcher_favorites'); if (key) saveToStorage(key, favorites) }
function loadFavorites() { const key = mkKey('offer_catcher_favorites'); return key ? (loadFromStorage(key) || []) : [] }

function saveResumes(resumes) { const key = mkKey('offer_catcher_resumes'); if (key) saveToStorage(key, resumes) }
function loadResumes() { const key = mkKey('offer_catcher_resumes'); return key ? (loadFromStorage(key) || []) : [] }

function saveCareerTags(tags) { const key = mkKey('offer_catcher_career_tags'); if (key) saveToStorage(key, tags) }
function loadCareerTags() { const key = mkKey('offer_catcher_career_tags'); return key ? loadFromStorage(key) : null }

function saveProfile(profile) {
  if (!store.user) return
  saveToStorage(`offer_catcher_profile_${store.user.id}`, profile)
  Object.assign(store.user, profile)
  saveToStorage('offer_catcher_user', store.user)
}
function loadProfile() {
  if (!store.user) return null
  return loadFromStorage(`offer_catcher_profile_${store.user.id}`)
}

function saveLikedNotes(likedNotes) { const key = mkKey('offer_catcher_liked_notes'); if (key) saveToStorage(key, likedNotes) }
function loadLikedNotes() { const key = mkKey('offer_catcher_liked_notes'); return key ? (loadFromStorage(key) || []) : [] }

function saveCommunityNotes(notes) { saveToStorage('offer_catcher_community_notes', notes) }
function loadCommunityNotes() { return loadFromStorage('offer_catcher_community_notes') || [] }

function saveDiagnoseHistory(history) { const key = mkKey('offer_catcher_diagnose_history'); if (key) saveToStorage(key, history) }
function loadDiagnoseHistory() { const key = mkKey('offer_catcher_diagnose_history'); return key ? (loadFromStorage(key) || []) : [] }

function saveLikedArticles(likedArticles) { const key = mkKey('offer_catcher_liked_articles'); if (key) saveToStorage(key, likedArticles) }
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
  saveDiagnoseHistory, loadDiagnoseHistory,
  saveLikedArticles, loadLikedArticles
})

export function useUserStore() {
  return store
}

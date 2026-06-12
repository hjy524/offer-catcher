/**
 * Supabase 存储模块
 * 替代 localStorage，数据存储在云端 Supabase 数据库
 */

import { supabase } from './supabase'

// 缓存 - 避免重复请求
let dataCache = {}
let communityCache = []
let lastFetch = 0
const CACHE_TTL = 2000 // 2秒缓存

/**
 * 获取某个用户的所有数据
 */
async function fetchUserData(userId) {
  if (!userId) return null

  const now = Date.now()
  if (dataCache[userId] && (now - lastFetch) < CACHE_TTL) {
    return dataCache[userId]
  }

  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.warn('Supabase fetch error:', error.message)
      return null
    }

    const result = data?.data || {}
    dataCache[userId] = result
    lastFetch = now
    return result
  } catch (e) {
    console.warn('Supabase fetch failed:', e)
    return null
  }
}

/**
 * 保存某个用户的全部数据
 */
async function saveUserData(userId, username, userData) {
  if (!userId) return false

  try {
    dataCache[userId] = { ...userData }

    // 检查记录是否存在
    const { data: existing } = await supabase
      .from('user_data')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      // 更新
      const { error } = await supabase
        .from('user_data')
        .update({ data: userData, username })
        .eq('user_id', userId)
      if (error) throw error
    } else {
      // 插入
      const { error } = await supabase
        .from('user_data')
        .insert({ user_id: userId, username, data: userData })
      if (error) throw error
    }
    return true
  } catch (e) {
    console.warn('Supabase save failed:', e)
    return false
  }
}

/**
 * 保存特定字段（合并到 data 中）
 */
async function saveUserField(userId, username, field, value) {
  const userData = await fetchUserData(userId) || {}
  userData[field] = value
  return saveUserData(userId, username, userData)
}

/**
 * 加载特定字段
 */
async function loadUserField(userId, field, defaultValue = null) {
  const userData = await fetchUserData(userId)
  if (!userData) return defaultValue
  return userData[field] !== undefined ? userData[field] : defaultValue
}

// ===== 社区笔记 =====

async function fetchCommunityNotes() {
  const now = Date.now()
  if (communityCache.length > 0 && (now - lastFetch) < CACHE_TTL) {
    return communityCache
  }

  try {
    const { data, error } = await supabase
      .from('community_notes')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    communityCache = data || []
    lastFetch = now
    return communityCache
  } catch (e) {
    console.warn('fetchCommunityNotes failed:', e)
    return []
  }
}

async function saveCommunityNotes(notes) {
  communityCache = notes
  try {
    // 清空并重新插入
    const { error: delErr } = await supabase
      .from('community_notes')
      .delete()
      .neq('id', -1) // 删除所有
    if (delErr) throw delErr

    if (notes.length > 0) {
      // 确保每个笔记有所有字段
      const rows = notes.map(n => ({
        id: n.id,
        author: n.author || '',
        title: n.title || '',
        content: n.content || '',
        category: n.category || '其他',
        cover: n.cover || '',
        date: n.date || '',
        likes: n.likes || 0,
        comments: n.comments || []
      }))
      const { error: insErr } = await supabase
        .from('community_notes')
        .insert(rows)
      if (insErr) throw insErr
    }
    return true
  } catch (e) {
    console.warn('saveCommunityNotes failed:', e)
    return false
  }
}

// ===== 工具 =====

/**
 * 将 localStorage 数据迁移到 Supabase
 */
async function migrateLocalStorage(userId, username) {
  const keys = [
    'resumes', 'journals', 'my_notes', 'favorites',
    'ai_chat', 'profile', 'diagnose_history',
    'career_tags', 'liked_notes', 'liked_articles'
  ]
  const userData = {}
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(`offer_catcher_${key}_${userId}`)
      if (raw) userData[key] = JSON.parse(raw)
    } catch {}
  }
  return saveUserData(userId, username, userData)
}

export {
  fetchUserData,
  saveUserData,
  saveUserField,
  loadUserField,
  fetchCommunityNotes,
  saveCommunityNotes,
  migrateLocalStorage
}

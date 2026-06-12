<template>
  <div class="note-detail-page" :class="{ 'mine-mode': isMineMode }">
    <div class="detail-layout">
      <!-- 左侧主内容 -->
      <div class="detail-main">
        <!-- 返回按钮 -->
        <div class="back-bar">
          <el-button text @click="goBack">← 返回</el-button>
          <span class="breadcrumb" v-if="isMineMode">我的笔记</span>
          <span class="breadcrumb" v-else>社区笔记</span>
        </div>

        <!-- 笔记内容 -->
        <div v-if="note" class="note-content-card">
          <div class="note-header">
            <h1 class="note-title">{{ note.title }}</h1>
            <div class="note-meta">
              <span class="author-avatar">{{ (note.author || '?').charAt(0) }}</span>
              <span class="author-name">{{ note.author }}</span>
              <span class="publish-date">{{ note.date }}</span>
              <el-tag size="small" effect="light">{{ note.category }}</el-tag>
            </div>
          </div>

          <img v-if="note.cover" :src="note.cover" class="note-cover-img" />

          <!-- 编辑模式 -->
          <div v-if="isEditing" class="edit-area">
            <el-input v-model="editTitle" placeholder="标题" class="edit-input" />
            <el-select v-model="editCategory" placeholder="分类" class="edit-input">
              <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
            </el-select>
            <el-input
              v-model="editContent"
              type="textarea"
              :rows="10"
              placeholder="内容"
              class="edit-input"
            />
            <el-input v-model="editCover" placeholder="配图URL（可选）" class="edit-input" />
            <div class="edit-actions">
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </div>
          </div>

          <!-- 展示模式 -->
          <div v-else class="note-body">
            <p class="note-text">{{ note.content }}</p>
          </div>

          <div class="note-actions">
            <el-button
              :type="isLiked ? 'primary' : 'default'"
              round
              @click="toggleLike"
            >
              {{ isLiked ? '👍 已赞' : '👍 点赞' }} {{ note.likes }}
            </el-button>
            <el-button
              :type="isFavorited ? 'warning' : 'default'"
              round
              @click="toggleFavorite"
            >
              {{ isFavorited ? '⭐ 已收藏' : '⭐ 收藏' }}
            </el-button>
            <el-button v-if="isAuthor" type="primary" plain round @click="startEdit">
              ✏️ 编辑笔记
            </el-button>
          </div>

          <!-- 评论区 -->
          <div class="comments-section">
            <h4>💬 评论 ({{ note.comments?.length || 0 }})</h4>
            <div class="comments-list">
              <div v-for="comment in note.comments" :key="comment.id" class="comment-item">
                <span class="comment-avatar">{{ (comment.author || '?').charAt(0) }}</span>
                <div class="comment-body">
                  <span class="comment-author">{{ comment.author }}</span>
                  <p class="comment-text">{{ comment.content }}</p>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
              </div>
              <div v-if="!note.comments?.length" class="no-comments">暂无评论，快来抢沙发吧~</div>
            </div>
            <div class="comment-input">
              <el-input v-model="newComment" placeholder="写下你的评论..." @keyup.enter="submitComment" />
              <el-button type="primary" @click="submitComment">发送</el-button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📄</div>
          <p>笔记不存在或已被删除</p>
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>

      <!-- ===== 右侧侧边栏（仅个人模式，公共模式不显示） ===== -->
      <div v-if="isMineMode" class="detail-sidebar">

        <!-- 搜索 -->
        <div class="sidebar-card">
          <h4>🔍 搜索{{ isMineMode ? '我的' : '' }}笔记</h4>
          <el-input v-model="searchText" placeholder="搜索标题或内容..." size="small" clearable />
        </div>

        <!-- 分类筛选 -->
        <div class="sidebar-card">
          <h4>📂 按分类</h4>
          <div class="sidebar-tags">
            <span
              v-for="cat in categories"
              :key="cat"
              :class="['sidebar-tag', { active: filterCategory === cat }]"
              @click="filterCategory = filterCategory === cat ? '' : cat"
            >{{ cat }}</span>
          </div>
        </div>

        <!-- 时间筛选 -->
        <div class="sidebar-card">
          <h4>📅 按时间</h4>
          <div class="time-filter-row">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
              size="small"
              style="width:100%"
              value-format="YYYY-MM-DD"
              @change="onDateRangeChange"
            />
          </div>
          <div class="quick-date-tags">
            <span
              v-for="q in quickDates"
              :key="q.key"
              :class="['quick-date-tag', { active: quickDateKey === q.key }]"
              @click="setQuickDate(q.key)"
            >{{ q.label }}</span>
          </div>
        </div>

        <!-- 排序 -->
        <div class="sidebar-card">
          <h4>📊 排序方式</h4>
          <el-radio-group v-model="sortOrder" size="small" @change="applyFilters">
            <el-radio-button value="desc">最新优先</el-radio-button>
            <el-radio-button value="asc">最早优先</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 活跃筛选条件 -->
        <div v-if="hasActiveFilters" class="sidebar-card active-filters-card">
          <div class="active-filters-header">
            <h4>🔎 筛选条件</h4>
            <el-button text size="small" type="primary" @click="clearAllFilters">清除全部</el-button>
          </div>
          <div class="filter-chips">
            <el-tag v-if="searchText" closable size="small" @close="searchText = ''">
              搜索: {{ searchText }}
            </el-tag>
            <el-tag v-if="filterCategory && filterCategory !== '全部'" closable size="small" @close="filterCategory = ''">
              分类: {{ filterCategory }}
            </el-tag>
            <el-tag v-if="dateRange" closable size="small" @close="dateRange = null; quickDateKey = ''">
              日期: {{ dateRange[0] }} ~ {{ dateRange[1] }}
            </el-tag>
            <el-tag v-if="selectedCalDate" closable size="small" @close="selectedCalDate = ''">
              日期: {{ selectedCalDate }}
            </el-tag>
          </div>
        </div>

        <!-- 笔记数量统计 -->
        <div class="sidebar-card stats-card">
          <div class="stats-row">
            <span>共 <b>{{ filteredNotesList.length }}</b> 篇笔记</span>
            <span v-if="isMineMode">我的笔记</span>
            <span v-else>全部笔记</span>
          </div>
        </div>

        <!-- 笔记列表（无上限，全部展示） -->
        <div class="sidebar-card notes-list-card">
          <h4>{{ isMineMode ? '📝 我的笔记' : '📝 全部笔记' }}</h4>
          <div class="sidebar-notes-list" ref="notesListRef">
            <div
              v-for="item in filteredNotesList"
              :key="item.id || item._key"
              :class="['sidebar-note-item', { active: item.id === note?.id }]"
              @click="switchNote(item)"
            >
              <div class="sidebar-note-category">{{ item.category }}</div>
              <div class="sidebar-note-title">{{ item.title }}</div>
              <div class="sidebar-note-footer">
                <span class="sidebar-note-date">{{ item.date }}</span>
                <span class="sidebar-note-stats">👍 {{ item.likes || 0 }}</span>
              </div>
            </div>
            <div v-if="filteredNotesList.length === 0" class="no-data">
              <p>暂无匹配的笔记</p>
              <el-button text size="small" type="primary" @click="clearAllFilters">清除筛选条件</el-button>
            </div>
          </div>
        </div>

        <!-- 迷你日历（双用途：日志 + 笔记） -->
        <div class="sidebar-card">
          <h4>📅 日历视图</h4>
          <div class="mini-month-nav">
            <span @click="prevMonth">&lt;</span>
            <b>{{ calYear }}年{{ calMonth }}月</b>
            <span @click="nextMonth">&gt;</span>
          </div>
          <div class="calendar-legend">
            <span><span class="legend-dot blue"></span> 有笔记</span>
            <span><span class="legend-dot green"></span> 有日志</span>
            <span><span class="legend-dot purple"></span> 笔记+日志</span>
          </div>
          <div class="mini-calendar">
            <div class="mini-weekday" v-for="d in ['日','一','二','三','四','五','六']" :key="d">{{ d }}</div>
            <div
              v-for="(day, i) in miniCalendarDays" :key="i"
              :class="['mini-day', {
                'has-content': day && (hasNoteOnDay(day) || hasJournalOnDay(day)),
                'selected': isCalDateSelected(day),
                'empty': !day
              }]"
              @click="day && toggleCalDate(day)"
            >
              <span class="day-num">{{ day || '' }}</span>
              <span v-if="day && hasNoteOnDay(day) && hasJournalOnDay(day)" class="day-dot both-dot"></span>
              <span v-else-if="day && hasNoteOnDay(day)" class="day-dot note-dot"></span>
              <span v-else-if="day && hasJournalOnDay(day)" class="day-dot journal-dot"></span>
            </div>
          </div>
          <div v-if="selectedCalDate" class="calendar-filter-hint">
            <span>📌 {{ selectedCalDate }}</span>
            <el-button size="small" text type="primary" @click="selectedCalDate = ''">清除</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const note = ref(null)
const isMineMode = ref(route.query.mine === 'true')

// 编辑
const isEditing = ref(false)
const editTitle = ref('')
const editCategory = ref('')
const editContent = ref('')
const editCover = ref('')

// 评论
const newComment = ref('')

// ===== 筛选 =====
const searchText = ref('')
const filterCategory = ref('')
const sortOrder = ref('desc')
const dateRange = ref(null)           // [start, end]
const quickDateKey = ref('')
const selectedCalDate = ref('')       // 日历选中的日期

const quickDates = [
  { key: 'week', label: '近一周' },
  { key: 'month', label: '近一月' },
  { key: 'quarter', label: '近三月' },
  { key: 'year', label: '近一年' },
]

// 点赞收藏
const likedNotes = ref([])
const favoritedNotes = ref([])

// 日历
const calYear = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth() + 1)

// 数据
const allNotes = ref([])
const journals = ref([])
const notesListRef = ref(null)

const categories = ['全部', '面试经验', '简历技巧', '职场心得', '学习资源', '其他']

// 是否有活跃筛选
const hasActiveFilters = computed(() => {
  return searchText.value || (filterCategory.value && filterCategory.value !== '全部') || dateRange.value || selectedCalDate.value
})

// 是否作者
const isAuthor = computed(() => {
  if (!userStore.isLoggedIn || !note.value) return false
  return note.value.author === userStore.user.username
})

// 统一日期格式为 YYYY-MM-DD，兼容各种输入格式
const normalizeDate = (d) => {
  if (!d) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
  const m = d.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/)
  if (m) return `${m[1]}-${String(Number(m[2])).padStart(2, '0')}-${String(Number(m[3])).padStart(2, '0')}`
  return d
}

// ===== 筛选后的笔记列表 =====
const filteredNotesList = computed(() => {
  let result = allNotes.value

  // 模式：mine 只显示当前用户
  if (isMineMode.value && userStore.isLoggedIn) {
    result = result.filter(n => n.author === userStore.user.username)
  }

  // 搜索
  if (searchText.value) {
    const q = searchText.value.toLowerCase()
    result = result.filter(n =>
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.content && n.content.toLowerCase().includes(q))
    )
  }

  // 分类
  if (filterCategory.value && filterCategory.value !== '全部') {
    result = result.filter(n => n.category === filterCategory.value)
  }

  // 日期范围
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    result = result.filter(n => {
      const nd = normalizeDate(n.date)
      return nd && nd >= start && nd <= end
    })
  }

  // 日历选中日期
  if (selectedCalDate.value) {
    result = result.filter(n => normalizeDate(n.date) === selectedCalDate.value)
  }

  // 排序
  result = [...result].sort((a, b) => {
    const dateA = normalizeDate(a.date || '')
    const dateB = normalizeDate(b.date || '')
    if (sortOrder.value === 'desc') return dateB.localeCompare(dateA)
    return dateA.localeCompare(dateB)
  })

  return result
})

const isLiked = computed(() => note.value && likedNotes.value.includes(note.value.id))
const isFavorited = computed(() => note.value && favoritedNotes.value.includes(note.value.id))

// ===== 快速日期 =====
const setQuickDate = (key) => {
  if (quickDateKey.value === key) {
    quickDateKey.value = ''
    dateRange.value = null
    return
  }
  quickDateKey.value = key
  const now = new Date()
  const end = now.toISOString().slice(0, 10)
  let start
  switch (key) {
    case 'week': start = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10); break
    case 'month': start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().slice(0, 10); break
    case 'quarter': start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString().slice(0, 10); break
    case 'year': start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10); break
    default: start = end
  }
  dateRange.value = [start, end]
  selectedCalDate.value = ''
}

const onDateRangeChange = () => {
  quickDateKey.value = ''
  selectedCalDate.value = ''
}

const clearAllFilters = () => {
  searchText.value = ''
  filterCategory.value = ''
  dateRange.value = null
  quickDateKey.value = ''
  selectedCalDate.value = ''
}

const applyFilters = () => {
  // 计算属性自动响应，仅保留用于排序切换等
}

// ===== 数据加载 =====
const loadNoteData = () => {
  const noteId = Number(route.params.id)

  const communityNotes = userStore.loadCommunityNotes() || []
  const myNotes = userStore.loadMyNotes() || []

  const seen = new Set()
  allNotes.value = [...communityNotes, ...myNotes].filter(n => {
    if (seen.has(n.id)) return false
    seen.add(n.id)
    return true
  })

  const found = allNotes.value.find(n => n.id === noteId)
  if (found) {
    note.value = JSON.parse(JSON.stringify(found))
  }

  likedNotes.value = userStore.loadLikedNotes() || []
  favoritedNotes.value = userStore.loadFavorites() || []
  journals.value = userStore.loadJournals() || []
}

const goBack = () => {
  if (isMineMode.value) {
    router.push('/user?tab=community')
  } else {
    router.push('/community')
  }
}

const switchNote = (item) => {
  router.push(`/note/${item.id}${isMineMode.value ? '?mine=true' : ''}`)
}

// 点赞、收藏、编辑、评论
const toggleLike = () => {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); return }
  const idx = likedNotes.value.indexOf(note.value.id)
  if (idx > -1) { likedNotes.value.splice(idx, 1); note.value.likes-- }
  else { likedNotes.value.push(note.value.id); note.value.likes++; ElMessage.success('点赞成功') }
  userStore.saveLikedNotes(likedNotes.value)
  syncNoteToStore()
}

const toggleFavorite = () => {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); return }
  const idx = favoritedNotes.value.indexOf(note.value.id)
  if (idx > -1) { favoritedNotes.value.splice(idx, 1); ElMessage.info('已取消收藏') }
  else { favoritedNotes.value.push(note.value.id); ElMessage.success('收藏成功') }
  userStore.saveFavorites(favoritedNotes.value)
}

const startEdit = () => {
  editTitle.value = note.value.title
  editCategory.value = note.value.category
  editContent.value = note.value.content
  editCover.value = note.value.cover || ''
  isEditing.value = true
}

const saveEdit = () => {
  if (!editTitle.value.trim() || !editContent.value.trim()) {
    ElMessage.warning('标题和内容不能为空')
    return
  }
  note.value.title = editTitle.value.trim()
  note.value.category = editCategory.value || '其他'
  note.value.content = editContent.value.trim()
  note.value.cover = editCover.value.trim()
  syncNoteToStore()
  isEditing.value = false
  ElMessage.success('笔记已更新')
}

const cancelEdit = () => { isEditing.value = false }

const syncNoteToStore = () => {
  const target = allNotes.value.find(n => n.id === note.value.id)
  if (target) Object.assign(target, note.value)

  const communityNotes = userStore.loadCommunityNotes() || []
  const idx1 = communityNotes.findIndex(n => n.id === note.value.id)
  if (idx1 > -1) { communityNotes[idx1] = JSON.parse(JSON.stringify(note.value)); userStore.saveCommunityNotes(communityNotes) }
  else { communityNotes.unshift(JSON.parse(JSON.stringify(note.value))); userStore.saveCommunityNotes(communityNotes) }

  const myNotes = userStore.loadMyNotes() || []
  const idx2 = myNotes.findIndex(n => n.id === note.value.id)
  if (idx2 > -1) { myNotes[idx2] = JSON.parse(JSON.stringify(note.value)); userStore.saveMyNotes(myNotes) }
}

const submitComment = () => {
  if (!userStore.isLoggedIn) { ElMessage.warning('请先登录'); return }
  if (!newComment.value.trim()) { ElMessage.warning('请输入评论内容'); return }
  const comment = { id: Date.now(), author: userStore.user.username, content: newComment.value.trim(), time: new Date().toLocaleString() }
  if (!note.value.comments) note.value.comments = []
  note.value.comments.push(comment)
  newComment.value = ''
  syncNoteToStore()
  ElMessage.success('评论成功')
}

// ===== 日历 =====
const prevMonth = () => {
  if (calMonth.value === 1) { calMonth.value = 12; calYear.value-- } else calMonth.value--
}
const nextMonth = () => {
  if (calMonth.value === 12) { calMonth.value = 1; calYear.value++ } else calMonth.value++
}
const miniCalendarDays = computed(() => {
  const first = new Date(calYear.value, calMonth.value - 1, 1).getDay()
  const days = new Date(calYear.value, calMonth.value, 0).getDate()
  const arr = []
  for (let i = 0; i < first; i++) arr.push('')
  for (let i = 1; i <= days; i++) arr.push(i)
  return arr
})
const formatCalDay = (day) => day ? `${calYear.value}-${String(calMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''

const hasNoteOnDay = (day) => {
  if (!day) return false
  const ds = formatCalDay(day)
  return allNotes.value.some(n => {
    if (isMineMode.value && userStore.isLoggedIn && n.author !== userStore.user.username) return false
    return normalizeDate(n.date) === ds
  })
}

const hasJournalOnDay = (day) => {
  if (!day) return false
  const ds = formatCalDay(day)
  return journals.value.some(j => normalizeDate(j.date || j.createdAt || '').includes(ds))
}

const isCalDateSelected = (day) => {
  if (!day) return false
  return selectedCalDate.value === formatCalDay(day)
}

const toggleCalDate = (day) => {
  const ds = formatCalDay(day)
  if (selectedCalDate.value === ds) {
    selectedCalDate.value = ''
  } else {
    // 点击日历日期时，清除其他日期筛选
    dateRange.value = null
    quickDateKey.value = ''
    selectedCalDate.value = ds
  }
}

// 当路由变化时重新加载
watch(() => route.params.id, () => {
  loadNoteData()
  isMineMode.value = route.query.mine === 'true'
})

onMounted(() => {
  loadNoteData()
})
</script>

<style scoped>
.note-detail-page {
  padding-top: 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.detail-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 公共模式（无侧边栏）— 内容居中窄版 */
.note-detail-page:not(.mine-mode) .detail-layout {
  max-width: 860px;
  justify-content: center;
}

.note-detail-page:not(.mine-mode) .detail-main {
  max-width: 100%;
}

.detail-main { flex: 1; min-width: 0; }

.detail-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 84px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.back-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.breadcrumb { font-size: 13px; color: #999; }

/* 笔记主内容 */
.note-content-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.note-header { margin-bottom: 24px; }
.note-title { font-size: 26px; font-weight: 700; color: #1a1a2e; margin-bottom: 16px; line-height: 1.4; }
.note-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.author-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: #fff; display: inline-flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 600;
}
.author-name { font-weight: 500; color: #333; }
.publish-date { font-size: 13px; color: #999; }
.note-cover-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 24px; }
.note-body { min-height: 200px; }
.note-text { font-size: 16px; line-height: 1.9; color: #333; white-space: pre-wrap; }

.edit-area { display: flex; flex-direction: column; gap: 12px; }
.edit-input { width: 100%; }
.edit-actions { display: flex; gap: 12px; margin-top: 8px; }

.note-actions {
  display: flex; gap: 12px; margin: 24px 0; padding-top: 24px;
  border-top: 1px solid #f0f0f0; flex-wrap: wrap;
}

.comments-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0; }
.comments-section h4 { margin-bottom: 16px; color: #333; font-size: 16px; }
.comments-list { margin-bottom: 16px; }
.comment-item { display: flex; gap: 12px; margin-bottom: 16px; }
.comment-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.comment-body { flex: 1; }
.comment-author { font-weight: 500; color: #333; margin-right: 8px; }
.comment-text { color: #666; margin: 4px 0; }
.comment-time { font-size: 12px; color: #999; }
.no-comments { text-align: center; color: #999; padding: 20px; }
.comment-input { display: flex; gap: 12px; }
.comment-input .el-input { flex: 1; }

.empty-state { text-align: center; padding: 80px 20px; background: #fff; border-radius: 16px; }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-state p { color: #999; margin-bottom: 16px; }

/* ===== 侧边栏通用 ===== */
.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.sidebar-card h4 {
  font-size: 13px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

/* 分类标签 */
.sidebar-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.sidebar-tag {
  padding: 3px 10px; border-radius: 12px; background: #f0f0f0;
  font-size: 12px; cursor: pointer; color: #666; transition: all 0.2s;
}
.sidebar-tag:hover { background: #dbeafe; }
.sidebar-tag.active { background: #2563eb; color: #fff; }

/* 时间筛选 */
.time-filter-row { margin-bottom: 6px; }
.quick-date-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.quick-date-tag {
  padding: 2px 8px; border-radius: 8px; background: #f5f5f5;
  font-size: 11px; cursor: pointer; color: #666; transition: all 0.2s;
}
.quick-date-tag:hover { background: #dbeafe; }
.quick-date-tag.active { background: #2563eb; color: #fff; }

/* 排序 */
.sidebar-card .el-radio-group { width: 100%; display: flex; }
.sidebar-card .el-radio-button { flex: 1; }
.sidebar-card .el-radio-button__inner { font-size: 12px; padding: 4px 8px; }

/* 活跃筛选 */
.active-filters-card { background: #fffbeb; border: 1px solid #fde68a; }
.active-filters-header { display: flex; justify-content: space-between; align-items: center; }
.active-filters-header h4 { margin-bottom: 0; }
.filter-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
.filter-chips .el-tag { font-size: 11px; }

/* 统计卡片 */
.stats-card { padding: 10px 16px; }
.stats-row { display: flex; justify-content: space-between; font-size: 13px; color: #666; }

/* 笔记列表 - 无上限滚动 */
.notes-list-card { padding-bottom: 8px; }
.sidebar-notes-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 420px;
  overflow-y: auto;
}
.sidebar-notes-list::-webkit-scrollbar { width: 4px; }
.sidebar-notes-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

.sidebar-note-item {
  padding: 8px 10px; border-radius: 8px; cursor: pointer;
  transition: all 0.15s; border-left: 3px solid transparent;
}
.sidebar-note-item:hover { background: #f0f4ff; }
.sidebar-note-item.active { background: #eff6ff; border-left-color: #2563eb; }

.sidebar-note-category {
  font-size: 10px; color: #3b82f6; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;
}
.sidebar-note-title {
  font-size: 13px; color: #333; font-weight: 500; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.sidebar-note-footer { display: flex; justify-content: space-between; margin-top: 3px; }
.sidebar-note-date { font-size: 11px; color: #999; }
.sidebar-note-stats { font-size: 11px; color: #bbb; }

/* 日历 */
.mini-month-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 14px; }
.mini-month-nav span { cursor: pointer; color: #2563eb; user-select: none; font-weight: 600; }

.calendar-legend { display: flex; gap: 12px; margin-bottom: 6px; font-size: 11px; color: #999; }
.legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 2px; }
.legend-dot.blue { background: #3b82f6; }
.legend-dot.green { background: #10b981; }
.legend-dot.purple { background: #7c3aed; }

.mini-calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; }
.mini-weekday { font-size: 11px; color: #999; padding: 4px 0; }
.mini-day {
  font-size: 13px;
  padding: 6px 0 16px;
  border-radius: 4px;
  cursor: default;
  color: #ccc;
  position: relative;
  line-height: 1;
}
.mini-day .day-num { position: relative; z-index: 1; }
.mini-day .day-dot {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.mini-day .day-dot.note-dot { background: #3b82f6; }
.mini-day .day-dot.journal-dot { background: #10b981; }
.mini-day .day-dot.both-dot { width: 7px; height: 7px; background: #7c3aed; }
.mini-day.empty { cursor: default; }
.mini-day.has-content { cursor: pointer; }
.mini-day.selected { background: #2563eb !important; color: #fff !important; }
.mini-day.selected .day-dot { background: #fff !important; }
.mini-day:not(.empty):hover { background: #dbeafe; }

.calendar-filter-hint { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; padding: 4px 8px; background: #eff6ff; border-radius: 6px; font-size: 12px; color: #2563eb; }

@media (max-width: 900px) {
  .detail-layout { flex-direction: column; }
  .note-detail-page:not(.mine-mode) .detail-layout { max-width: 100%; }
  .detail-sidebar { width: 100%; position: static; max-height: none; overflow-y: visible; }
}
</style>

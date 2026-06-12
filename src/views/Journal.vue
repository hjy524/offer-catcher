<template>
  <div class="journal-page">
    <div class="journal-layout">
      <!-- 左侧主内容 -->
      <div class="journal-main">

      <!-- 快速记录区 -->
      <div class="quick-input">
        <div class="input-header" style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="input-icon">📝</span>
            <span class="input-title">快速记录此刻心情</span>
          </div>
          <el-button type="warning" plain size="small" @click="runAIInsight" :loading="insightLoading">
            🤖 AI洞察
          </el-button>
        </div>
        <el-input
          v-model="quickContent"
          type="textarea"
          :rows="3"
          placeholder="记录你的求职心路历程..."
          @keyup.ctrl.enter="addJournal"
        />
        <div class="input-footer">
          <div class="tag-input">
            <span class="tag-label">标签：</span>
            <el-tag
              v-for="tag in selectedTags"
              :key="tag"
              closable
              size="small"
              @close="removeTag(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-model="newTag"
              placeholder="输入标签"
              size="small"
              @keyup.enter="addTag"
              style="width: 120px"
            />
            <el-button size="small" @click="addTag" :disabled="!newTag.trim()">+添加</el-button>
          </div>
          <el-button type="primary" round @click="addJournal">记录</el-button>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-tabs">
          <span
            :class="['tab', { active: filterType === 'all' }]"
            @click="filterType = 'all'; journalDateFilter = ''"
          >
            全部
          </span>
          <span
            :class="['tab', { active: filterType === 'pinned' }]"
            @click="filterType = 'pinned'"
          >
            📌 已置顶
          </span>
        </div>
        <div class="tag-filter">
          <span
            v-for="tag in allTags"
            :key="tag"
            :class="['tag-item', { active: filterTag === tag }]"
            @click="filterTag = filterTag === tag ? '' : tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 日志列表 -->
      <div class="journal-list">
        <div v-if="filteredJournals.length === 0" class="empty-state">
          <div class="empty-icon">📔</div>
          <p>还没有记录，开始写下你的求职心路吧~</p>
        </div>

        <div
          v-for="journal in filteredJournals"
          :key="journal.id"
          class="journal-item"
        >
          <div class="journal-time">
            <span class="date">{{ journal.date }}</span>
            <span class="time">{{ journal.time }}</span>
          </div>
          <div class="journal-tags" v-if="(journal.tags || []).length > 0">
            <el-tag v-for="tag in journal.tags" :key="tag" size="small" type="primary" effect="light" round>{{ tag }}</el-tag>
          </div>
          <div class="journal-content">
            <p>{{ journal.content }}</p>
          </div>
          <div class="journal-actions">
            <el-button
              :type="journal.pinned ? 'warning' : 'default'"
              size="small"
              text
              @click="togglePin(journal)"
            >
              {{ journal.pinned ? '📌 已置顶' : '📌 置顶' }}
            </el-button>
            <el-button size="small" text @click="editJournal(journal)">✏️ 编辑</el-button>
            <el-button size="small" text type="danger" @click="deleteJournal(journal)">🗑️ 删除</el-button>
          </div>
        </div>
      </div>

      </div><!-- end journal-main -->

      <!-- 右侧侧边栏 -->
      <div class="journal-sidebar">
        <!-- 搜索框 -->
        <div class="sidebar-card">
          <h4>🔍 搜索日志</h4>
          <el-input v-model="searchText" placeholder="搜索内容..." size="small" clearable />
        </div>

        <!-- AI洞察 -->
        <div class="sidebar-card">
          <h4>🤖 AI洞察</h4>
          <p class="sidebar-tip">选择标签和/或时间区间后分析</p>
          <el-select v-model="insightTagFilter" placeholder="按标签筛选(可选)" size="small" clearable style="width:100%;margin-bottom:6px">
            <el-option v-for="tag in allTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
          <el-date-picker
            v-model="insightDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            style="width:100%;margin-bottom:6px"
            value-format="YYYY-MM-DD"
          />
          <el-button type="warning" size="small" @click="runFilteredInsight" :loading="insightLoading" style="width:100%">生成洞察</el-button>
          <div v-if="insightResult" class="insight-mini" v-html="formatMarkdown(insightResult)"></div>
        </div>

        <!-- 迷你日历 -->
        <div class="sidebar-card">
          <h4>📅 日志日历</h4>
          <div class="mini-month-nav">
            <span @click="prevMonth">&lt;</span>
            <b>{{ calYear }}年{{ calMonth }}月</b>
            <span @click="nextMonth">&gt;</span>
          </div>
          <div class="mini-calendar">
            <div class="mini-weekday" v-for="d in ['日','一','二','三','四','五','六']" :key="d">{{ d }}</div>
            <div v-for="(day, i) in miniCalendarDays" :key="i"
              :class="['mini-day', { 'has': hasJournalContent(day), 'empty': !day, 'selected': isSelectedDate(day) }]"
              @click="day && selectMiniDate(day)"
            >
              {{ day || '' }}
            </div>
          </div>
          <div v-if="journalDateFilter" class="calendar-filter-hint">
            <span>筛选：{{ journalDateFilter }}</span>
            <el-button size="small" text type="primary" @click="journalDateFilter = ''">显示全部</el-button>
          </div>
        </div>

        <!-- 标签筛选 -->
        <div class="sidebar-card">
          <h4>🏷️ 标签筛选</h4>
          <div class="sidebar-tags">
            <span v-for="tag in allTags" :key="tag"
              :class="['sidebar-tag', { active: filterTag === tag }]"
              @click="filterTag = filterTag === tag ? '' : tag"
            >{{ tag }}</span>
            <span v-if="allTags.length === 0" class="no-tags">暂无标签</span>
          </div>
        </div>
      </div><!-- end sidebar -->
    </div><!-- end journal-layout -->

      <!-- 编辑弹窗 -->
      <el-dialog v-model="showEditModal" title="编辑日志" width="500px">
        <el-form label-width="60px">
          <el-form-item label="内容">
            <el-input
              v-model="editForm.content"
              type="textarea"
              :rows="5"
              placeholder="记录你的求职心路历程..."
            />
          </el-form-item>
          <el-form-item label="标签">
            <el-tag
              v-for="tag in editForm.tags"
              :key="tag"
              closable
              @close="editForm.tags = editForm.tags.filter(t => t !== tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-model="editNewTag"
              placeholder="输入标签"
              size="small"
              @keyup.enter="addEditTag"
              style="width: 120px; margin-left: 8px"
            />
            <el-button size="small" @click="addEditTag" :disabled="!editNewTag.trim()" style="margin-left:4px">+添加</el-button>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showEditModal = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </template>
      </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { aiService } from '@/utils/aiService'
import { formatMarkdown } from '@/utils/markdown'

const userStore = useUserStore()

const quickContent = ref('')
const selectedTags = ref([])
const newTag = ref('')
const filterType = ref('all')
const filterTag = ref('')
const showEditModal = ref(false)
const editForm = ref({ id: null, content: '', tags: [] })
const editNewTag = ref('')

// 日志数据
const journals = ref([])

// 所有标签
const allTags = computed(() => {
  const tags = new Set()
  journals.value.forEach(j => {
    if (j.tags) j.tags.forEach(t => tags.add(t))
  })
  return Array.from(tags)
})

// 过滤日志
const filteredJournals = computed(() => {
  let result = [...journals.value]

  if (filterType.value === 'pinned') result = result.filter(j => j.pinned)
  if (filterTag.value) result = result.filter(j => (j.tags || []).includes(filterTag.value))
  if (searchText.value) result = result.filter(j => j.content && j.content.includes(searchText.value))
  if (journalDateFilter.value) {
    const f = journalDateFilter.value
    result = result.filter(j => {
      const d = normDate(j.date || j.createdAt)
      return d === f || (j.createdAt || '').startsWith(f)
    })
  }

  return result.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
})

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }
  newTag.value = ''
}

// 移除标签
const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

// 添加日志
const addJournal = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  if (!quickContent.value.trim()) {
    ElMessage.warning('请输入内容')
    return
  }

  const now = new Date()
  const journal = {
    id: Date.now(),
    content: quickContent.value.trim(),
    tags: [...selectedTags.value],
    date: now.toISOString().slice(0, 10),
    time: now.toLocaleTimeString('zh-CN'),
    createdAt: now.toISOString(),
    pinned: false
  }

  journals.value.unshift(journal)
  quickContent.value = ''
  selectedTags.value = []

  saveJournals()
  ElMessage.success('记录成功')
}

// 编辑日志
const editJournal = (journal) => {
  editForm.value = {
    id: journal.id,
    content: journal.content,
    tags: [...(journal.tags || [])]
  }
  showEditModal.value = true
}

// 添加编辑标签
const addEditTag = () => {
  const tag = editNewTag.value.trim()
  if (tag && !editForm.value.tags.includes(tag)) {
    editForm.value.tags.push(tag)
  }
  editNewTag.value = ''
}

// 保存编辑
const saveEdit = () => {
  const index = journals.value.findIndex(j => j.id === editForm.value.id)
  if (index > -1) {
    journals.value[index].content = editForm.value.content
    journals.value[index].tags = editForm.value.tags
    saveJournals()
    ElMessage.success('保存成功')
  }
  showEditModal.value = false
}

// 删除日志
const deleteJournal = (journal) => {
  ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    journals.value = journals.value.filter(j => j.id !== journal.id)
    saveJournals()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 置顶/取消置顶
const togglePin = (journal) => {
  journal.pinned = !journal.pinned
  saveJournals()
  ElMessage.success(journal.pinned ? '已置顶' : '已取消置顶')
}

// 保存到localStorage
const saveJournals = () => {
  userStore.saveJournals(journals.value)
}

// AI洞察相关
const insightLoading = ref(false)
const insightResult = ref('')
const insightTagFilter = ref('')
const insightDateRange = ref(null)

// 带筛选的AI洞察
// 归一化日期为 YYYY-MM-DD 格式
const normDate = (d) => {
  if (!d) return ''
  if (d.includes('T')) return d.slice(0, 10) // ISO: 2026-06-09T...
  const m = d.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/)
  if (m) return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`
  return d
}

const runFilteredInsight = async () => {
  if (journals.value.length === 0) { ElMessage.warning('还没有日志记录'); return }
  let source = [...journals.value]
  if (insightTagFilter.value) { source = source.filter(j => (j.tags || []).includes(insightTagFilter.value)) }
  // 按日期区间筛选 - 归一化后比较
  if (insightDateRange.value && insightDateRange.value.length === 2) {
    const [start, end] = insightDateRange.value
    source = source.filter(j => {
      const d = normDate(j.date || j.createdAt)
      return d && d >= start && d <= end
    })
  }
  if (source.length === 0) { ElMessage.warning('没有符合筛选条件的日志'); return }
  insightLoading.value = true; insightResult.value = ''
  const journalsText = source.slice(0, 15).map(j =>
    `[${j.date}] ${(j.tags || []).length ? '#' + j.tags.join(' #') + ' ' : ''}${j.content}`
  ).join('\n')
  const conds = []
  if (insightDateRange.value) conds.push(`时间：${insightDateRange.value[0]}至${insightDateRange.value[1]}`)
  if (insightTagFilter.value) conds.push(`标签：#${insightTagFilter.value}`)
  const prompt = `基于以下求职者${source.length}篇心路日志${conds.length ? '（' + conds.join('，') + '）' : ''}，分析其心理状态、关注点和情绪趋势，并给出3-5条职业发展建议：\n\n${journalsText}`
  try {
    insightResult.value = await aiService.chat([{ role: 'user', content: prompt }])
  } catch { insightResult.value = 'AI分析失败' }
  finally { insightLoading.value = false }
}

// 搜索
const searchText = ref('')

// 迷你日历
const calYear = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth() + 1)
const prevMonth = () => { if (calMonth.value === 1) { calMonth.value = 12; calYear.value-- } else calMonth.value-- }
const nextMonth = () => { if (calMonth.value === 12) { calMonth.value = 1; calYear.value++ } else calMonth.value++ }
const miniCalendarDays = computed(() => {
  const first = new Date(calYear.value, calMonth.value - 1, 1).getDay()
  const days = new Date(calYear.value, calMonth.value, 0).getDate()
  const arr = []; for (let i = 0; i < first; i++) arr.push(''); for (let i = 1; i <= days; i++) arr.push(i); return arr
})
const formatCalDay = (day) => day ? `${calYear.value}-${String(calMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
const hasJournalContent = (day) => {
  if (!day) return false
  const ds = formatCalDay(day)
  return journals.value.some(j => (j.date || j.createdAt || '').includes(ds) || (j.createdAt || '').startsWith(ds))
}
const selectMiniDate = (day) => {
  const ds = formatCalDay(day)
  // 如果点击的是已选中的日期，则取消筛选（显示全部）
  if (journalDateFilter.value === ds) {
    journalDateFilter.value = ''
    return
  }
  filterTag.value = '' // 清空标签筛选
  searchText.value = '' // 清空搜索
  // 筛选该日期的日志
  journalDateFilter.value = ds
}

const isSelectedDate = (day) => {
  if (!day) return false
  return journalDateFilter.value === formatCalDay(day)
}

// 日期筛选（供filteredJournals使用）
const journalDateFilter = ref('')

// 加载数据
onMounted(() => {
  const saved = userStore.loadJournals()
  if (saved && saved.length > 0) {
    // 兼容旧数据：确保tags字段存在
    journals.value = saved.map(j => ({ ...j, tags: j.tags || [] }))
  }
})
</script>

<style scoped>
.journal-page {
  padding-top: 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

/* 双栏布局 */
.journal-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
.journal-main {
  flex: 1;
  min-width: 0;
}
.journal-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 84px;
}

/* 侧边栏卡片 */
.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.sidebar-card h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}
.sidebar-tip {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}
.sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.sidebar-tag {
  padding: 4px 10px;
  border-radius: 12px;
  background: #f0f0f0;
  font-size: 12px;
  cursor: pointer;
  color: #666;
}
.sidebar-tag:hover { background: #dbeafe; }
.sidebar-tag.active { background: #2563eb; color: #fff; }
.no-tags { font-size: 12px; color: #999; }

/* 迷你日历 */
.mini-month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}
.mini-month-nav span { cursor: pointer; color: #2563eb; user-select: none; }
.mini-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}
.mini-weekday {
  font-size: 11px;
  color: #999;
  padding: 4px 0;
}
.mini-day {
  font-size: 13px;
  padding: 6px 0 16px;
  border-radius: 4px;
  position: relative;
  line-height: 1;
  cursor: default;
  color: #ccc;
}
.mini-day.has {
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  background: #eff6ff;
}
.mini-day.has:hover { background: #dbeafe; }
.mini-day.selected { background: #2563eb; color: #fff; font-weight: 600; }
.calendar-filter-hint { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding: 6px 8px; background: #eff6ff; border-radius: 6px; font-size: 12px; color: #2563eb; }

/* AI洞察迷你结果 */
.insight-mini {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.6;
  color: #333;
  max-height: 300px;
  overflow-y: auto;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}
.insight-mini :deep(p) { margin: 4px 0; }
.insight-mini :deep(h3) { font-size: 14px; color: #2563eb; }

@media (max-width: 900px) {
  .journal-layout { flex-direction: column; }
  .journal-sidebar { width: 100%; position: static; }
}

.quick-input {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.input-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.input-icon {
  font-size: 24px;
}

.input-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.tag-input {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-label {
  font-size: 14px;
  color: #666;
}

.filter-bar {
  background: #fff;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.filter-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.tab {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.tag-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-item {
  padding: 4px 12px;
  border-radius: 12px;
  background: #f5f5f5;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-item:hover {
  background: rgba(37, 99, 235, 0.1);
}

.tag-item.active {
  background: #2563eb;
  color: #fff;
}

.journal-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 16px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
}

.journal-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.journal-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.journal-time {
  display: flex;
  gap: 12px;
}

.date {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.time {
  font-size: 13px;
  color: #999;
}

.journal-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 6px 0 8px 0;
  padding: 4px 0;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 4px 0;
}

.journal-content p {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 8px;
}

.journal-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>

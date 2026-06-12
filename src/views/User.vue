<template>
  <div class="user-page">
    <div class="container">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-avatar-large" @click="triggerAvatarUpload" :title="avatarSrc ? '点击更换头像' : '点击上传头像'">
          <img v-if="avatarSrc" :src="avatarSrc" class="avatar-img" />
          <span v-else class="avatar-placeholder">👤</span>
          <div class="avatar-overlay">📷</div>
        </div>
        <input ref="avatarInput" type="file" accept="image/*" @change="handleAvatarUpload" hidden />
        <div class="user-info">
          <h2>{{ currentUser?.username || '未登录用户' }}</h2>
          <p>注册时间：{{ currentUser?.createdAt ? formatDate(currentUser.createdAt) : '未知' }}</p>
          <p>求职意向：{{ profileForm.intent || '未设置' }}</p>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ resumes.length }}</span>
            <span class="stat-label">简历版本</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ journals.length }}</span>
            <span class="stat-label">心路日志</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ favorites.length }}</span>
            <span class="stat-label">收藏岗位</span>
          </div>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-grid">
        <div class="menu-card" @click="activeTab = 'resume'">
          <div class="menu-icon">📄</div>
          <span class="menu-title">简历管理</span>
          <span class="menu-count">{{ resumes.length }}份简历</span>
        </div>
        <div class="menu-card" @click="activeTab = 'favorites'">
          <div class="menu-icon">⭐</div>
          <span class="menu-title">收藏岗位</span>
          <span class="menu-count">{{ favorites.length }}个岗位</span>
        </div>
        <div class="menu-card" @click="activeTab = 'journal'">
          <div class="menu-icon">📝</div>
          <span class="menu-title">心路日志</span>
          <span class="menu-count">{{ journals.length }}篇</span>
        </div>
        <div class="menu-card" @click="activeTab = 'community'">
          <div class="menu-icon">👥</div>
          <span class="menu-title">社区笔记</span>
          <span class="menu-count">{{ myNotes.length }}篇</span>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 简历管理 -->
        <div v-if="activeTab === 'resume'" class="tab-content">
          <h3>📄 我的简历</h3>
          <div v-if="resumes.length === 0" class="empty-hint">暂无简历，去<a @click="$router.push('/resume')">创建简历</a></div>
          <div v-else class="resume-list">
            <div v-for="(resume, idx) in resumes" :key="resume.id" class="resume-item" style="cursor:pointer" @click="previewResume(resume)">
              <div class="resume-info">
                <span class="resume-name">{{ resume.name || '未命名' }}的简历
                  <el-tag v-if="idx === 0" size="small" type="success" effect="dark" style="margin-left:8px">最新</el-tag>
                </span>
                <span class="resume-date">{{ formatDate(resume.created_at) }}</span>
              </div>
              <div class="resume-actions" @click.stop>
                <el-button link type="primary" @click="editResume(resume)">编辑</el-button>
                <el-button type="danger" text @click="deleteResume(resume)">删除</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 收藏岗位 -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <h3>⭐ 收藏的岗位</h3>
          <div v-if="favorites.length === 0" class="empty-hint">暂无收藏，去<a @click="$router.push('/job-match')">匹配岗位</a></div>
          <div v-else class="favorites-list">
            <div v-for="job in favorites" :key="job.id" class="favorite-item">
              <div class="job-info">
                <h4>{{ job.name }}</h4>
                <p>{{ job.company }} · {{ job.location }} · {{ job.salary }}</p>
              </div>
              <div class="job-actions">
                <el-button type="primary" size="small" @click="$router.push('/resume-check')">诊断优化</el-button>
                <el-button type="danger" text size="small" @click="removeFavorite(job)">取消收藏</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 心路日志 -->
        <div v-if="activeTab === 'journal'" class="tab-content">
          <h3>📝 我的心路日志</h3>
          <div v-if="journals.length === 0" class="empty-hint">暂无日志，去<a @click="$router.push('/journal')">写日志</a></div>
          <div v-else class="journal-list">
            <div v-for="journal in journals" :key="journal.id" class="journal-item">
              <div class="journal-tags" v-if="journal.tags && journal.tags.length">
                <el-tag v-for="tag in journal.tags" :key="tag" size="small" effect="light" round>{{ tag }}</el-tag>
              </div>
              <p class="journal-content">{{ journal.content }}</p>
              <span class="journal-date">{{ journal.date }}</span>
            </div>
          </div>
          <el-button type="primary" plain class="open-calendar-btn" @click="showJournalCalendar = true">
            📅 打开日历看板
          </el-button>
        </div>

        <!-- 社区笔记 -->
        <div v-if="activeTab === 'community'" class="tab-content">
          <h3>👥 我的社区笔记</h3>
          <div v-if="myNotes.length === 0" class="empty-hint">暂无笔记，去<a @click="$router.push('/community')">发布笔记</a></div>
          <div v-else class="notes-list">
            <div v-for="note in myNotes" :key="note.id" class="note-item">
              <div class="note-info">
                <h4>{{ note.title }}</h4>
                <p class="note-stats">👍 {{ note.likes || 0 }} · 💬 {{ note.commentsCount || 0 }}</p>
              </div>
              <div class="note-actions">
                <el-button link type="primary" @click="$router.push(`/note/${note.id}?mine=true`)">查看</el-button>
                <el-button type="danger" text @click="deleteNote(note)">删除</el-button>
              </div>
            </div>
          </div>
          <el-button type="primary" plain class="open-calendar-btn" @click="showNoteCalendar = true">
            📅 打开日历看板
          </el-button>
        </div>
      </div>

      <!-- 设置侧边栏 -->
      <div class="settings-sidebar">
        <h3>设置</h3>
        <div class="settings-list">
          <div class="setting-item" @click="editProfile">
            <span class="setting-icon">👤</span>
            <span>编辑个人资料</span>
          </div>
          <div class="setting-item" @click="showDiagnostics">
            <span class="setting-icon">📄</span>
            <span>历史诊断报告</span>
          </div>
          <div class="setting-item" @click="showChatHistory">
            <span class="setting-icon">💬</span>
            <span>AI对话记录</span>
          </div>
          <div class="setting-item" @click="exportData">
            <span class="setting-icon">📥</span>
            <span>导出数据</span>
          </div>
          <div class="setting-item danger" @click="handleLogout">
            <span class="setting-icon">🚪</span>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑资料弹窗 -->
    <el-dialog v-model="showEditProfile" title="编辑个人资料" width="500px">
      <el-form :model="profileForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" disabled />
        </el-form-item>
        <el-form-item label="求职意向">
          <el-input v-model="profileForm.intent" placeholder="如：前端开发工程师" />
        </el-form-item>
        <el-form-item label="学历">
          <el-select v-model="profileForm.education" placeholder="选择学历">
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士" value="硕士" />
            <el-option label="博士" value="博士" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="profileForm.major" placeholder="如：计算机科学与技术" />
        </el-form-item>
        <el-form-item label="毕业年份">
          <el-input v-model="profileForm.graduationYear" placeholder="如：2026" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditProfile = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </template>
    </el-dialog>

    <!-- 简历预览弹窗 -->
    <el-dialog v-model="showResumePreview" title="简历详情" width="700px">
      <div v-if="previewResumeData" class="resume-detail-preview">
        <h3 style="text-align:center;margin-bottom:20px;">{{ previewResumeData.name || '未命名' }}的简历</h3>
        <div class="preview-row"><b>学历：</b>{{ previewResumeData.education || '-' }} | <b>专业：</b>{{ previewResumeData.major || '-' }}</div>
        <div class="preview-row"><b>毕业年份：</b>{{ previewResumeData.graduationYear || '-' }} | <b>求职意向：</b>{{ previewResumeData.intent || '-' }}</div>
        <div class="preview-row" v-if="previewResumeData.summary"><b>个人简介：</b>{{ previewResumeData.summary }}</div>
        <div v-if="previewResumeData.experience?.length" class="preview-section">
          <h4>实习经历</h4>
          <div v-for="exp in previewResumeData.experience" :key="exp.company" class="preview-exp">
            <p><b>{{ exp.company }} - {{ exp.position }}</b> ({{ exp.duration }})</p>
            <p>{{ exp.description }}</p>
          </div>
        </div>
        <div v-if="previewResumeData.projects?.length" class="preview-section">
          <h4>项目经验</h4>
          <div v-for="proj in previewResumeData.projects" :key="proj.name">
            <p><b>{{ proj.name }}</b> - {{ proj.role }}</p>
            <p>{{ proj.description }}</p>
          </div>
        </div>
        <div v-if="previewResumeData.skills?.length" class="preview-section">
          <h4>技能特长</h4>
          <el-tag v-for="skill in previewResumeData.skills" :key="skill" style="margin:2px;">{{ skill }}</el-tag>
        </div>
      </div>
    </el-dialog>

    <!-- 诊断历史弹窗 -->
    <el-dialog v-model="showDiagHistory" title="📄 历史诊断报告" width="600px">
      <div v-if="diagnoseHistory.length === 0" class="empty-hint">暂无诊断记录</div>
      <div v-else class="diag-list">
        <div v-for="(item, idx) in diagnoseHistory" :key="idx" class="diag-item">
          <div class="diag-header">
            <span class="diag-score">匹配度: {{ item.score }}%</span>
            <span class="diag-date">{{ item.date }}</span>
          </div>
          <p class="diag-jd">{{ item.jdTitle || 'JD摘要: ' + (item.jdContent || '').slice(0, 50) + '...' }}</p>
          <div class="diag-detail" v-if="item.expanded">
            <h5>达标项</h5><ul><li v-for="(m,i) in (item.meetItems||[])" :key="i">{{ m }}</li></ul>
            <h5>缺失项</h5><ul><li v-for="(m,i) in (item.missingItems||[])" :key="i">{{ m }}</li></ul>
            <h5>优化建议</h5><ul><li v-for="(s,i) in (item.suggestions||[])" :key="i">{{ s }}</li></ul>
            <div v-if="item.content" class="diag-content"><h5>优化简历</h5><pre>{{ item.content }}</pre></div>
          </div>
          <el-button link type="primary" size="small" @click="item.expanded = !item.expanded">
            {{ item.expanded ? '收起详情' : '展开详情' }}
          </el-button>
          <el-button link type="primary" size="small" @click="$router.push(`/diagnose-detail/${idx}`)" style="margin-left:8px">
            查看详情 →
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- AI对话历史弹窗 -->
    <el-dialog v-model="showAICHist" title="💬 AI对话记录" width="700px">
      <div v-if="chatHistory.length === 0" class="empty-hint">暂无对话记录</div>
      <div v-else class="chat-history-list">
        <div v-for="(msg, idx) in chatHistory" :key="idx" :class="['chat-msg', msg.role]">
          <span class="chat-role">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
          <div class="chat-text">{{ msg.content?.substring(0, 200) }}{{ msg.content?.length > 200 ? '...' : '' }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showAICHist = false">关闭</el-button>
        <el-button type="primary" @click="$router.push('/chat-history')">查看全部对话 →</el-button>
      </template>
    </el-dialog>

    <!-- 心路日志日历看板弹窗 -->
    <el-dialog
      v-model="showJournalCalendar"
      title="📅 心路日志日历"
      width="900px"
      :close-on-click-modal="false"
    >
      <div class="calendar-container">
        <!-- 月份切换 -->
        <div class="month-nav">
          <el-button @click="prevMonth">&lt;</el-button>
          <span class="month-label">{{ calYear }}年{{ calMonth }}月</span>
          <el-button @click="nextMonth">&gt;</el-button>
        </div>
        <!-- 搜索和筛选 -->
        <div class="calendar-toolbar">
          <el-input
            v-model="journalSearch"
            placeholder="搜索日志内容..."
            clearable
            style="width: 200px"
          />
          <el-select v-model="journalTagFilter" placeholder="按标签筛选" clearable style="width: 150px">
            <el-option v-for="tag in allJournalTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
          <el-date-picker
            v-model="journalDateFilter"
            type="date"
            placeholder="按日期筛选"
            value-format="YYYY-MM-DD"
            clearable
            style="width: 150px"
          />
        </div>

        <!-- 日历网格 -->
        <div class="calendar-grid">
          <div class="calendar-header">
            <span v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">{{ day }}</span>
          </div>
          <div class="calendar-days">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="['calendar-day', {
                'has-content': hasJournalContent(day),
                'selected': selectedJournalDate === formatCalDay(day),
                'empty': !day,
                'today': isToday(day)
              }]"
              @click="day && selectJournalDate(day)"
            >
              <span v-if="day" class="day-number">{{ day }}</span>
              <div v-if="day && hasJournalContent(day)" class="day-indicator">
                <span class="indicator-dot blue"></span>
              </div>
              <div v-else-if="day" class="day-indicator">
                <span class="indicator-dot gray"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 日志列表 -->
        <div class="journal-list-panel">
          <h4>{{ selectedJournalDate ? `📅 ${selectedJournalDate} 的日志` : '📝 所有日志' }}</h4>
          <div class="journal-entries">
            <div
              v-for="journal in filteredJournals"
              :key="journal.id"
              class="journal-entry"
            >
              <div class="entry-time">{{ journal.date }} {{ journal.time || '' }}</div>
              <div class="entry-content">{{ journal.content }}</div>
              <div class="entry-tags" v-if="journal.tags && journal.tags.length">
                <el-tag v-for="tag in journal.tags" :key="tag" size="small" effect="light">{{ tag }}</el-tag>
              </div>
            </div>
            <div v-if="filteredJournals.length === 0" class="no-data">
              暂无日志记录
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 社区笔记日历看板弹窗 -->
    <el-dialog
      v-model="showNoteCalendar"
      title="📅 社区笔记日历"
      width="900px"
      :close-on-click-modal="false"
    >
      <div class="calendar-container">
        <!-- 月份切换 -->
        <div class="month-nav">
          <el-button @click="prevMonth">&lt;</el-button>
          <span class="month-label">{{ calYear }}年{{ calMonth }}月</span>
          <el-button @click="nextMonth">&gt;</el-button>
        </div>
        <!-- 搜索和筛选 -->
        <div class="calendar-toolbar">
          <el-input
            v-model="noteSearch"
            placeholder="搜索笔记标题..."
            clearable
            style="width: 200px"
          />
          <el-date-picker
            v-model="noteDateFilter"
            type="date"
            placeholder="按日期筛选"
            value-format="YYYY-MM-DD"
            clearable
            style="width: 150px"
          />
        </div>

        <!-- 日历网格 -->
        <div class="calendar-grid">
          <div class="calendar-header">
            <span v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">{{ day }}</span>
          </div>
          <div class="calendar-days">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="['calendar-day', {
                'has-content': hasNoteContent(day),
                'selected': selectedNoteDate === formatCalDay(day),
                'empty': !day,
                'today': isToday(day)
              }]"
              @click="day && selectNoteDate(day)"
            >
              <span v-if="day" class="day-number">{{ day }}</span>
              <div v-if="day && hasNoteContent(day)" class="day-indicator">
                <span class="indicator-dot blue"></span>
              </div>
              <div v-else-if="day" class="day-indicator">
                <span class="indicator-dot gray"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 笔记列表 -->
        <div class="journal-list-panel">
          <h4>{{ selectedNoteDate ? `📅 ${selectedNoteDate} 的笔记` : '📝 所有笔记' }}</h4>
          <div class="journal-entries">
            <div
              v-for="note in filteredNotes"
              :key="note.id"
              class="journal-entry"
            >
              <div class="entry-time">{{ note.date || '' }}</div>
              <div class="entry-content">{{ note.title }}</div>
              <div class="entry-stats">
                👍 {{ note.likes || 0 }} · 💬 {{ note.commentsCount || note.comments?.length || 0 }}
              </div>
            </div>
            <div v-if="filteredNotes.length === 0" class="no-data">
              暂无笔记记录
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// 头像上传
const avatarInput = ref(null)
const avatarSrc = ref('')
const triggerAvatarUpload = () => { avatarInput.value?.click() }
const handleAvatarUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    avatarSrc.value = ev.target.result
    userStore.saveProfile({ ...(userStore.loadProfile() || {}), avatar: ev.target.result })
  }
  reader.readAsDataURL(file)
}
const currentUser = computed(() => userStore.user)

const activeTab = ref(route.query.tab || 'resume')
const showEditProfile = ref(false)
const showDiagHistory = ref(false)
const showAICHist = ref(false)

// 日历看板相关
const showJournalCalendar = ref(false)
const showNoteCalendar = ref(false)
const journalSearch = ref('')
const journalTagFilter = ref('')
const journalDateFilter = ref('')
const selectedJournalDate = ref('')

const noteSearch = ref('')
const noteDateFilter = ref('')
const selectedNoteDate = ref('')

// 日历月份
const calYear = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth() + 1)

// 数据
const resumes = ref([])
const favorites = ref([])
const journals = ref([])
const myNotes = ref([])
const diagnoseHistory = ref([])
const chatHistory = ref([])

// Profile
const profileForm = reactive({
  username: '',
  intent: '',
  education: '',
  major: '',
  graduationYear: ''
})

// 从localStorage加载真实数据
onMounted(() => {
  loadData()
})

const loadData = () => {
  // 按时间倒序排列简历，确保最新版本排第一
  const allResumes = userStore.loadResumes() || []
  resumes.value = allResumes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  favorites.value = userStore.loadFavorites()
  journals.value = userStore.loadJournals()

  // 清理杂乱的测试笔记
  const rawMyNotes = userStore.loadMyNotes() || []
  const messyTitles = ['33', '2', '1', '对方过后', '对方之后', '3', '对方']
  const cleanedNotes = rawMyNotes.filter(n => {
    if (!n.title) return true
    const t = n.title.trim()
    if (messyTitles.includes(t)) return false
    if (t.length <= 2 && (!n.content || n.content.length < 10)) return false
    return true
  })
  if (cleanedNotes.length !== rawMyNotes.length) {
    userStore.saveMyNotes(cleanedNotes)
  }
  myNotes.value = cleanedNotes
  diagnoseHistory.value = userStore.loadDiagnoseHistory()
  chatHistory.value = userStore.loadAIChat()

  // Load profile
  const profile = userStore.loadProfile()
  if (profile) {
    Object.assign(profileForm, profile)
    if (profile.avatar) avatarSrc.value = profile.avatar
  }
  if (currentUser.value) {
    profileForm.username = currentUser.value.username
  }
}

// 日历月份切换
const prevMonth = () => {
  if (calMonth.value === 1) {
    calMonth.value = 12
    calYear.value--
  } else {
    calMonth.value--
  }
}

const nextMonth = () => {
  if (calMonth.value === 12) {
    calMonth.value = 1
    calYear.value++
  } else {
    calMonth.value++
  }
}

// 生成日历天数
const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(calYear.value, calMonth.value - 1, 1).getDay()
  const daysInMonth = new Date(calYear.value, calMonth.value, 0).getDate()

  for (let i = 0; i < firstDay; i++) {
    days.push('')
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  return days
})

const formatCalDay = (day) => {
  if (!day) return ''
  return `${calYear.value}-${String(calMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const isToday = (day) => {
  if (!day) return false
  const today = new Date()
  return calYear.value === today.getFullYear() && calMonth.value === today.getMonth() + 1 && day === today.getDate()
}

// 检查某天是否有日志
const hasJournalContent = (day) => {
  if (!day) return false
  const dateStr = formatCalDay(day)
  return journals.value.some(j => {
    const jDate = j.date || j.createdAt || ''
    return jDate.includes(dateStr) || (j.createdAt && j.createdAt.startsWith(dateStr))
  })
}

// 检查某天是否有笔记
const hasNoteContent = (day) => {
  if (!day) return false
  const dateStr = formatCalDay(day)
  return myNotes.value.some(n => {
    const nDate = n.date || n.createdAt || ''
    return nDate.includes(dateStr) || (n.createdAt && n.createdAt.startsWith(dateStr))
  })
}

// 选择日期
const selectJournalDate = (day) => {
  const dateStr = formatCalDay(day)
  if (selectedJournalDate.value === dateStr) {
    selectedJournalDate.value = ''
    journalDateFilter.value = ''
  } else {
    selectedJournalDate.value = dateStr
    journalDateFilter.value = dateStr
  }
}

const selectNoteDate = (day) => {
  const dateStr = formatCalDay(day)
  if (selectedNoteDate.value === dateStr) {
    selectedNoteDate.value = ''
    noteDateFilter.value = ''
  } else {
    selectedNoteDate.value = dateStr
    noteDateFilter.value = dateStr
  }
}

// 所有标签
const allJournalTags = computed(() => {
  const tags = new Set()
  journals.value.forEach(j => {
    if (j.tags) j.tags.forEach(t => tags.add(t))
  })
  return Array.from(tags)
})

// 筛选后的日志
const filteredJournals = computed(() => {
  return journals.value.filter(j => {
    if (journalSearch.value && !j.content?.includes(journalSearch.value)) return false
    if (journalTagFilter.value && !(j.tags || []).includes(journalTagFilter.value)) return false
    if (journalDateFilter.value) {
      const jDate = j.date || j.createdAt || ''
      if (!jDate.includes(journalDateFilter.value) && !(j.createdAt && j.createdAt.startsWith(journalDateFilter.value))) return false
    }
    return true
  }).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
})

// 筛选后的笔记
const filteredNotes = computed(() => {
  return myNotes.value.filter(n => {
    if (noteSearch.value && !n.title?.includes(noteSearch.value)) return false
    if (noteDateFilter.value) {
      const nDate = n.date || n.createdAt || ''
      if (!nDate.includes(noteDateFilter.value) && !(n.createdAt && n.createdAt.startsWith(noteDateFilter.value))) return false
    }
    return true
  }).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
})

// 操作函数
const editProfile = () => {
  if (currentUser.value) {
    profileForm.username = currentUser.value.username
  }
  showEditProfile.value = true
}

const saveProfile = () => {
  userStore.saveProfile({
    intent: profileForm.intent,
    education: profileForm.education,
    major: profileForm.major,
    graduationYear: profileForm.graduationYear
  })
  showEditProfile.value = false
  ElMessage.success('个人资料保存成功')
}

const showDiagnostics = () => {
  showDiagHistory.value = true
}

const showChatHistory = () => {
  chatHistory.value = userStore.loadAIChat()
  showAICHist.value = true
}

const exportData = () => {
  const data = {
    profile: userStore.loadProfile(),
    resumes: userStore.loadResumes(),
    journals: userStore.loadJournals(),
    favorites: userStore.loadFavorites(),
    myNotes: userStore.loadMyNotes(),
    chatHistory: userStore.loadAIChat(),
    exportTime: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `offer_catcher_data_${new Date().toLocaleDateString()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('数据导出成功')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push('/')
  }).catch(() => {})
}

const editResume = (resume) => {
  localStorage.setItem('edit_resume_id', resume.id)
  router.push('/resume?tab=create')
}

// 简历预览
const showResumePreview = ref(false)
const previewResumeData = ref(null)
const previewResume = (resume) => {
  previewResumeData.value = resume
  showResumePreview.value = true
}

const deleteResume = (resume) => {
  ElMessageBox.confirm('确定要删除这份简历吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumes.value = resumes.value.filter(r => r.id !== resume.id)
    userStore.saveResumes(resumes.value)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const removeFavorite = (job) => {
  favorites.value = favorites.value.filter(f => f.id !== job.id)
  userStore.saveFavorites(favorites.value)
  ElMessage.success('已取消收藏')
}

const deleteNote = (note) => {
  ElMessageBox.confirm('确定要删除这篇笔记吗？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    myNotes.value = myNotes.value.filter(n => n.id !== note.id)
    userStore.saveMyNotes(myNotes.value)
    // 同时从社区笔记中删除
    const communityNotes = userStore.loadCommunityNotes() || []
    const updated = communityNotes.filter(n => n.id !== note.id)
    userStore.saveCommunityNotes(updated)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const formatDate = (date) => {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('zh-CN')
  } catch {
    return date
  }
}
</script>

<style scoped>
.user-page {
  padding: 80px 0 50px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: #fff;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 24px;
}

.user-avatar-large {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.user-avatar-large:hover .avatar-overlay {
  opacity: 1;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.avatar-placeholder {
  font-size: 48px;
}
.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 50%;
}

.user-info h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.user-info p {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.user-stats {
  display: flex;
  gap: 40px;
  margin-left: auto;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.menu-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
}

.menu-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.menu-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.menu-count {
  font-size: 12px;
  color: #999;
}

.content-area {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.tab-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.empty-hint {
  text-align: center;
  padding: 40px;
  color: #999;
}

.empty-hint a {
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
}

.resume-list,
.favorites-list,
.journal-list,
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resume-item,
.favorite-item,
.journal-item,
.note-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.resume-info,
.job-info,
.note-info {
  flex: 1;
}

.resume-name {
  font-size: 15px;
  font-weight: 500;
  margin-right: 12px;
}

.resume-date {
  font-size: 13px;
  color: #999;
}

.job-info h4 {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
}

.job-info p {
  font-size: 13px;
  color: #666;
}

.journal-item {
  flex-direction: column;
  align-items: flex-start;
}

.journal-tags {
  margin-bottom: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.journal-content {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.journal-date {
  font-size: 12px;
  color: #999;
}

.note-info h4 {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
}

.note-stats {
  font-size: 13px;
  color: #999;
}

.settings-sidebar {
  margin-top: 24px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.settings-sidebar h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}

.settings-list {
  display: flex;
  flex-direction: column;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  cursor: pointer;
  transition: color 0.3s;
}

.setting-item:hover {
  color: #2563eb;
}

.setting-item.danger {
  color: #ef4444;
}

.setting-item.danger:hover {
  color: #dc2626;
}

/* 诊断历史 */
.diag-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.diag-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.diag-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.diag-score {
  font-weight: 600;
  color: #2563eb;
}

.diag-date {
  font-size: 13px;
  color: #999;
}

.diag-jd {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}
.diag-detail {
  margin-top: 8px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
.diag-detail h5 { font-size: 13px; color: #333; margin: 8px 0 4px; }
.diag-detail ul { padding-left: 20px; margin: 4px 0; }
.diag-detail li { font-size: 12px; color: #666; line-height: 1.6; }
.diag-content pre { background: #f8f9fa; padding: 10px; border-radius: 4px; font-size: 12px; white-space: pre-wrap; }

/* AI对话历史 */
.chat-history-list {
  max-height: 500px;
  overflow-y: auto;
}

.chat-msg {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.chat-msg.assistant {
  background: #f8f9fa;
}

.chat-role {
  font-size: 20px;
  flex-shrink: 0;
}

.chat-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

/* 日历看板样式 */
.calendar-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.month-label {
  font-size: 16px;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

.calendar-toolbar {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.calendar-grid {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #eff6ff;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
}

.calendar-header span {
  padding: 10px;
  color: #1e40af;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #f3f4f6;
}

.calendar-day {
  background: #fff;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.calendar-day:hover:not(.empty) {
  background: #eff6ff;
}

.calendar-day.empty {
  background: #fafafa;
  cursor: default;
}

.calendar-day.selected {
  background: #dbeafe;
  border: 2px solid #2563eb;
}

.calendar-day.has-content {
  background: #f0f7ff;
}

.calendar-day.today .day-number {
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
}

.day-indicator {
  margin-top: 4px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.indicator-dot.blue {
  background: #2563eb;
}

.indicator-dot.gray {
  background: #ddd;
}

.journal-list-panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.journal-list-panel h4 {
  font-size: 15px;
  margin-bottom: 12px;
  color: #333;
}

.journal-entries {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.journal-entry {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  transition: all 0.2s;
}

.journal-entry:hover {
  background: #eff6ff;
}

.entry-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.entry-content {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
  color: #333;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.entry-stats {
  font-size: 12px;
  color: #999;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: #999;
}

.open-calendar-btn {
  margin-top: 16px;
  width: 100%;
}

@media (max-width: 1000px) {
  .user-card {
    flex-direction: column;
    text-align: center;
  }

  .user-stats {
    margin-left: 0;
    margin-top: 16px;
  }

  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

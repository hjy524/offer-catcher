<template>
  <div class="resume-check-page">
    <div class="container">
      <div class="page-header">
        <h1>JD简历诊断优化</h1>
        <p>粘贴岗位JD，AI为您的简历进行全面体检并提供优化建议</p>
      </div>

      <div class="main-content">
        <!-- JD输入区域 -->
        <div class="input-section">
          <div class="section-card">
            <h3>📋 岗位JD内容</h3>
            <textarea
              v-model="jdContent"
              placeholder="请粘贴目标岗位的JD描述..."
              rows="8"
            ></textarea>
          </div>

          <div class="section-card">
            <h3>📄 我的简历</h3>
            <textarea
              v-model="resumeContent"
              placeholder="请粘贴您的简历内容..."
              rows="8"
            ></textarea>
          </div>

          <div class="action-row">
            <el-button type="primary" size="large" @click="runDiagnose" :loading="isDiagnosing">
              🔍 AI智能诊断
            </el-button>
          </div>
        </div>

        <!-- 诊断结果区域 -->
        <div v-if="diagnoseResult" class="result-section">
          <div class="result-header">
            <h3>🏥 诊断报告</h3>
            <div class="score-display">
              <span class="score-value" :class="scoreClass">{{ diagnoseResult.score }}</span>
              <span class="score-label">综合匹配度</span>
            </div>
          </div>

          <!-- 达标项 -->
          <div class="result-card success">
            <h4>✅ 达标项</h4>
            <ul>
              <li v-for="(item, idx) in diagnoseResult.meetItems" :key="idx">{{ item }}</li>
            </ul>
          </div>

          <!-- 缺失短板项 -->
          <div class="result-card warning">
            <h4>⚠️ 缺失短板项</h4>
            <ul>
              <li v-for="(item, idx) in diagnoseResult.missingItems" :key="idx">{{ item }}</li>
            </ul>
          </div>

          <!-- 冗余内容 -->
          <div class="result-card info">
            <h4>📝 冗余无效内容</h4>
            <ul>
              <li v-for="(item, idx) in diagnoseResult.redundantItems" :key="idx">{{ item }}</li>
            </ul>
          </div>

          <!-- 优化建议 -->
          <div class="result-card suggestion">
            <h4>💡 优化建议</h4>
            <div class="suggestions-list">
              <div v-for="(suggestion, idx) in diagnoseResult.suggestions" :key="idx" class="suggestion-item">
                <span class="suggestion-num">{{ idx + 1 }}</span>
                <p>{{ suggestion }}</p>
              </div>
            </div>
          </div>

          <!-- 优化按钮 -->
          <div class="optimize-section">
            <el-button type="primary" @click="runOptimize" :loading="isOptimizing">
              ✨ AI优化简历
            </el-button>
          </div>

          <!-- 优化结果 -->
          <div v-if="optimizedResume" class="optimized-section">
            <h3>🎨 优化后的简历</h3>
            <div v-html="formatMarkdown(optimizedResume)" class="resume-preview optimized-markdown"></div>
            <div class="resume-actions">
              <el-button type="primary" @click="saveOptimized">保存优化版本</el-button>
              <el-button @click="downloadResume">下载TXT</el-button>
            </div>
          </div>
        </div>

        <!-- 示例JD参考 -->
        <div class="example-section">
          <h3>📌 示例JD参考（点击填充）</h3>
          <div class="example-cards">
            <div
              v-for="(example, idx) in exampleJDs"
              :key="idx"
              class="example-card"
              @click="fillJD(example)"
            >
              <h4>{{ example.title }}</h4>
              <p>{{ example.company }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { aiService } from '@/utils/aiService'
import { useUserStore } from '@/stores/user'
import { formatMarkdown } from '@/utils/markdown'

const userStore = useUserStore()

const jdContent = ref('')
const resumeContent = ref('')
const isDiagnosing = ref(false)
const isOptimizing = ref(false)

// 自动填充：从岗位匹配页跳转过来时带JD信息
onMounted(() => {
  const selectedJob = localStorage.getItem('selectedJob')
  if (selectedJob) {
    try {
      const job = JSON.parse(selectedJob)
      // 自动填充JD
      jdContent.value = [
        `【${job.name}】- ${job.company}`,
        `地点：${job.location} | 薪资：${job.salary}`,
        job.description || '',
        '任职要求：' + (job.requirements || []).join('；'),
        job.responsibilities ? '岗位职责：' + job.responsibilities.join('；') : ''
      ].filter(Boolean).join('\n')
      // 清除标记
      localStorage.removeItem('selectedJob')
      ElMessage.success('已自动填充岗位JD，请粘贴简历后开始诊断')
    } catch (e) {
      // ignore
    }
  }

  // 尝试自动填充用户简历（取最新）
  if (userStore.isLoggedIn) {
    const resumes = userStore.loadResumes()
    if (resumes && resumes.length > 0) {
      // 按创建时间降序排列，取最新的
      const sorted = [...resumes].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      const latest = sorted[0]
      const parts = []
      if (latest.name) parts.push(`姓名：${latest.name}`)
      if (latest.education) parts.push(`学历：${latest.education}`)
      if (latest.major) parts.push(`专业：${latest.major}`)
      if (latest.intent) parts.push(`求职意向：${latest.intent}`)
      if (latest.summary) parts.push(`简介：${latest.summary}`)
      if (latest.skills?.length) parts.push(`技能：${latest.skills.join('、')}`)
      if (latest.experience?.length) {
        parts.push('实习经历：')
        latest.experience.forEach(exp => {
          parts.push(`- ${exp.company || ''} ${exp.position || ''} ${exp.duration || ''}: ${exp.description || ''}`)
        })
      }
      if (latest.projects?.length) {
        parts.push('项目经验：')
        latest.projects.forEach(proj => {
          parts.push(`- ${proj.name || ''}: ${proj.description || ''}`)
        })
      }
      if (parts.length > 1) {
        resumeContent.value = parts.join('\n')
      }
    }
  }
})
const diagnoseResult = ref(null)
const optimizedResume = ref('')

const scoreClass = computed(() => {
  if (!diagnoseResult.value) return ''
  const s = diagnoseResult.value.score
  if (s >= 80) return 'score-high'
  if (s >= 50) return 'score-mid'
  return 'score-low'
})

const exampleJDs = [
  {
    title: '前端开发工程师',
    company: '字节跳动',
    content: '岗位职责：负责公司核心产品的前端开发工作；参与前端架构设计与优化；与产品、设计团队紧密协作。任职要求：本科及以上学历，计算机相关专业；熟悉Vue/React等主流前端框架；熟悉HTML/CSS/JavaScript；良好的沟通能力和团队协作精神。'
  },
  {
    title: 'Java后端开发',
    company: '阿里巴巴',
    content: '岗位职责：参与电商平台后端系统开发；负责高并发系统设计与优化；与前端团队协作完成接口开发。任职要求：本科及以上学历；扎实的Java基础；熟悉Spring Boot框架；了解分布式系统原理；良好的问题分析能力。'
  },
  {
    title: '产品经理',
    company: '腾讯',
    content: '岗位职责：负责社交产品的功能规划与迭代；收集用户反馈并分析需求；推动产品落地与上线。任职要求：本科及以上学历；逻辑思维清晰；有产品实习经验优先；良好的表达和沟通能力；对互联网产品有热情。'
  }
]

const fillJD = (example) => {
  jdContent.value = example.content
}

/**
 * Extract JSON from a string that may contain markdown code fences or plain JSON
 */
const extractJSON = (text) => {
  // Try direct parse first
  try {
    return JSON.parse(text)
  } catch (_) {
    // not pure JSON
  }

  // Try extracting from markdown code block ```json ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1])
    } catch (_) {
      // continue
    }
  }

  // Try finding the first { ... } block
  const braceMatch = text.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0])
    } catch (_) {
      // continue
    }
  }

  return null
}

/**
 * Calculate a rough score by keyword matching between JD and resume
 */
const calculateKeywordScore = (jd, resume) => {
  const jdLower = jd.toLowerCase()
  const resumeLower = resume.toLowerCase()

  // Extract potential keywords from JD (Chinese terms + English words)
  const jdKeywords = new Set()

  // Extract Chinese phrases (2-4 chars) that look like skills/requirements
  const chinesePatterns = [
    /熟悉([一-龥]{2,6})/g,
    /掌握([一-龥]{2,6})/g,
    /精通([一-龥]{2,6})/g,
    /了解([一-龥]{2,6})/g,
    /具备([一-龥]{2,6})/g,
    /具有([一-龥]{2,6})/g,
    /负责([一-龥]{2,6})/g,
    /参与([一-龥]{2,6})/g,
  ]
  chinesePatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(jdLower)) !== null) {
      jdKeywords.add(match[1])
    }
  })

  // Extract English tech keywords from JD
  const techKeywords = [
    'vue', 'react', 'angular', 'typescript', 'javascript', 'python', 'java',
    'node', 'go', 'rust', 'c++', 'spring', 'django', 'flask', 'docker',
    'kubernetes', 'k8s', 'mysql', 'redis', 'mongodb', 'elasticsearch',
    'html', 'css', 'webpack', 'vite', 'git', 'linux', 'aws', 'gcp',
    'azure', 'figma', 'sql', 'nosql', 'microservice', 'restful', 'api',
    'ci/cd', 'agile', 'scrum', 'devops', 'machine learning', 'deep learning',
    'nlp', 'cv', 'data analysis', 'product', 'design', 'ui', 'ux'
  ]
  techKeywords.forEach(kw => {
    if (jdLower.includes(kw)) jdKeywords.add(kw)
  })

  // Also extract degree requirements
  const degreeMatch = jdLower.match(/(本科|硕士|博士|大专|研究生)/)
  if (degreeMatch) jdKeywords.add(degreeMatch[1])

  if (jdKeywords.size === 0) return 50 // default mid score

  let matched = 0
  jdKeywords.forEach(kw => {
    if (resumeLower.includes(kw)) matched++
  })

  const rawScore = (matched / jdKeywords.size) * 100
  // Scale: 0-100 but bias slightly toward realism
  return Math.min(95, Math.max(10, Math.round(rawScore)))
}

/**
 * Parse AI response for diagnosis, whether JSON or plain text
 */
const parseDiagnosisResponse = (responseText, jd, resume) => {
  // Try extracting structured JSON
  const parsed = extractJSON(responseText)
  if (parsed && typeof parsed === 'object') {
    const score = typeof parsed.score === 'number'
      ? Math.min(100, Math.max(0, parsed.score))
      : calculateKeywordScore(jd, resume)

    return {
      score,
      meetItems: Array.isArray(parsed.meetItems) ? parsed.meetItems : (parsed.meets || []),
      missingItems: Array.isArray(parsed.missingItems) ? parsed.missingItems : (parsed.missing || []),
      redundantItems: Array.isArray(parsed.redundantItems) ? parsed.redundantItems : (parsed.redundant || []),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : (parsed.suggestion ? [parsed.suggestion] : [])
    }
  }

  // Fallback: parse text-based response and calculate keyword score
  const score = calculateKeywordScore(jd, resume)

  const lines = responseText.split('\n').filter(l => l.trim())
  const meetItems = []
  const missingItems = []
  const redundantItems = []
  const suggestions = []

  let currentSection = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (/达标|符合|满足|匹配|优势|亮点/.test(trimmed)) {
      currentSection = 'meet'
    } else if (/缺失|不足|短板|缺乏|缺少|弱点/.test(trimmed)) {
      currentSection = 'missing'
    } else if (/冗余|无效|多余|不相关|无关/.test(trimmed)) {
      currentSection = 'redundant'
    } else if (/建议|优化|改进|提升|推荐/.test(trimmed)) {
      currentSection = 'suggestion'
    } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*') || /^\d+[.、)]/.test(trimmed)) {
      const content = trimmed.replace(/^[-*•]\s*|\d+[.、)]\s*/, '').trim()
      if (!content) continue
      switch (currentSection) {
        case 'meet': meetItems.push(content); break
        case 'missing': missingItems.push(content); break
        case 'redundant': redundantItems.push(content); break
        case 'suggestion': suggestions.push(content); break
      }
    }
  }

  // If nothing parsed, put the whole response as a suggestion
  if (meetItems.length === 0 && missingItems.length === 0 && suggestions.length === 0) {
    suggestions.push(responseText.slice(0, 200))
  }

  return { score, meetItems, missingItems, redundantItems, suggestions }
}

const runDiagnose = async () => {
  if (!jdContent.value.trim()) {
    ElMessage.warning('请输入JD内容')
    return
  }
  if (!resumeContent.value.trim()) {
    ElMessage.warning('请输入简历内容')
    return
  }

  // Check AI configuration
  const configStatus = aiService.getConfigStatus()
  if (!configStatus.configured) {
    ElMessage.warning('AI服务未配置，请在 .env.local 中设置 VITE_AI_API_KEY，当前使用模拟数据')
  }

  isDiagnosing.value = true
  diagnoseResult.value = null
  optimizedResume.value = ''

  try {
    const response = await aiService.diagnoseResume(resumeContent.value, jdContent.value)
    const result = parseDiagnosisResponse(response, jdContent.value, resumeContent.value)
    diagnoseResult.value = result

    // Save diagnosis history to userStore
    if (userStore.isLoggedIn) {
      const history = userStore.loadDiagnoseHistory()
      history.unshift({
        id: Date.now(),
        jdContent: jdContent.value.slice(0, 100),
        resumeContent: resumeContent.value.slice(0, 100),
        score: result.score,
        meetItems: result.meetItems,
        missingItems: result.missingItems,
        suggestions: result.suggestions,
        createdAt: new Date().toISOString()
      })
      // Keep last 50 records
      if (history.length > 50) history.length = 50
      userStore.saveDiagnoseHistory(history)
    }
  } catch (error) {
    console.error('诊断失败:', error)
    ElMessage.error('诊断过程出错，请重试')
  } finally {
    isDiagnosing.value = false
  }
}

const runOptimize = async () => {
  if (!jdContent.value.trim() || !resumeContent.value.trim()) return

  isOptimizing.value = true
  optimizedResume.value = ''

  try {
    const response = await aiService.optimizeResume(resumeContent.value, jdContent.value)
    // The optimization returns plain text (the optimized resume)
    optimizedResume.value = response || '优化结果为空，请重试'
  } catch (error) {
    console.error('优化失败:', error)
    ElMessage.error('优化过程出错，请重试')
  } finally {
    isOptimizing.value = false
  }
}

const saveOptimized = () => {
  if (!optimizedResume.value) {
    ElMessage.warning('没有可保存的优化简历')
    return
  }

  if (userStore.isLoggedIn) {
    const resumes = userStore.loadResumes()
    resumes.unshift({
      id: Date.now(),
      title: `优化简历 - ${jdContent.value.slice(0, 20)}...`,
      content: optimizedResume.value,
      jdContent: jdContent.value,
      score: diagnoseResult.value?.score || 0,
      createdAt: new Date().toISOString()
    })
    // Keep last 20 resumes
    if (resumes.length > 20) resumes.length = 20
    userStore.saveResumes(resumes)
    ElMessage.success('简历已保存到我的简历中')
  } else {
    // Save to localStorage directly even if not logged in
    try {
      const existing = JSON.parse(localStorage.getItem('offer_catcher_guest_resumes') || '[]')
      existing.unshift({
        id: Date.now(),
        title: `优化简历 - ${jdContent.value.slice(0, 20)}...`,
        content: optimizedResume.value,
        jdContent: jdContent.value,
        score: diagnoseResult.value?.score || 0,
        createdAt: new Date().toISOString()
      })
      if (existing.length > 10) existing.length = 10
      localStorage.setItem('offer_catcher_guest_resumes', JSON.stringify(existing))
      ElMessage.success('简历已保存（登录后可同步到账户）')
    } catch {
      ElMessage.error('保存失败')
    }
  }
}

const downloadResume = () => {
  if (!optimizedResume.value) {
    ElMessage.warning('没有可下载的简历内容')
    return
  }

  // Create a Blob and trigger download
  const blob = new Blob([optimizedResume.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `优化简历_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  ElMessage.success('简历已下载')
}
</script>

<style scoped>
.resume-check-page {
  padding: 80px 0 50px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
}

.main-content {
  max-width: 1000px;
  margin: 0 auto;
}

.input-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.section-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-card h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

.section-card textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
}

.action-row {
  grid-column: 1 / -1;
  text-align: center;
}

.action-row .el-button {
  padding: 14px 48px;
  font-size: 16px;
}

.result-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 30px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.result-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.score-display {
  text-align: center;
}

.score-value {
  display: block;
  font-size: 48px;
  font-weight: 700;
  color: #2563eb;
}

.score-value.score-high {
  color: #16a34a;
}

.score-value.score-mid {
  color: #2563eb;
}

.score-value.score-low {
  color: #dc2626;
}

.score-label {
  font-size: 13px;
  color: #999;
}

.result-card {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
}

.result-card:last-child {
  margin-bottom: 0;
}

.result-card.success {
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
}

.result-card.warning {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
}

.result-card.info {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
}

.result-card.suggestion {
  background: #eff6ff;
  border-left: 4px solid #2563eb;
}

.result-card h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

.result-card ul {
  list-style: none;
  padding: 0;
}

.result-card li {
  font-size: 14px;
  padding: 6px 0;
  border-bottom: 1px dashed #ddd;
}

.result-card li:last-child {
  border-bottom: none;
}

.success li {
  color: #166534;
}

.warning li {
  color: #92400e;
}

.info li {
  color: #1d4ed8;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.suggestion-item {
  display: flex;
  gap: 12px;
}

.suggestion-num {
  width: 28px;
  height: 28px;
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}

.suggestion-item p {
  font-size: 14px;
  color: #666;
}

.optimize-section {
  text-align: center;
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid #eee;
}

.optimized-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.optimized-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.resume-preview {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.resume-preview :deep(p) {
  line-height: 1.8;
  color: #333;
  font-size: 14px;
  margin: 8px 0;
}
.resume-preview :deep(h1),
.resume-preview :deep(h2),
.resume-preview :deep(h3),
.resume-preview :deep(h4) {
  font-weight: 600;
  line-height: 1.3;
}
.resume-preview :deep(ul),
.resume-preview :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
}
.resume-preview :deep(li) {
  line-height: 1.7;
  margin: 4px 0;
}
.resume-preview :deep(code) {
  font-family: 'Consolas', monospace;
}
.resume-preview :deep(pre) {
  font-family: inherit;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
  color: #333;
}

/* 优化简历区域的统一色彩 - 覆盖 formatMarkdown 内联样式 */
.optimized-markdown :deep(h1),
.optimized-markdown :deep(h2),
.optimized-markdown :deep(h3),
.optimized-markdown :deep(h4) {
  color: #1e40af !important;
  border-bottom-color: #3b82f6 !important;
}
.optimized-markdown :deep(p) {
  color: #374151 !important;
  line-height: 1.8 !important;
}
.optimized-markdown :deep(strong) {
  color: #1e293b !important;
}
.optimized-markdown :deep(code) {
  background: #eef2ff !important;
  color: #1e40af !important;
}
.optimized-markdown :deep(pre) {
  background: #1e293b !important;
}
.optimized-markdown :deep(pre code) {
  background: transparent !important;
  color: #e2e8f0 !important;
}
.optimized-markdown :deep(li) {
  color: #374151 !important;
}
.optimized-markdown :deep(a) {
  color: #2563eb !important;
}

.resume-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.example-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.example-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.example-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.example-card {
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.example-card:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.example-card h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.example-card p {
  font-size: 13px;
  color: #666;
}
</style>
<template>
  <div class="resume-page">
    <div class="container">
      <div class="page-header">
        <h1>简历创建</h1>
        <p>支持多格式简历上传解析，零基础在线制作</p>
      </div>

      <!-- 功能切换标签 -->
      <div class="tab-switch">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="上传解析简历" name="upload">
            <div class="upload-section">
              <div
                class="upload-area"
                :class="{ 'drag-over': isDragOver }"
                @click="triggerUpload"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleDrop"
              >
                <div class="upload-icon">📁</div>
                <p>点击或拖拽上传简历</p>
                <p class="upload-tips">支持PDF、Word、图片格式，或粘贴纯文本</p>
                <input ref="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.png,.txt,.text" @change="handleFileUpload" hidden />
              </div>

              <!-- 上传状态提示 -->
              <div v-if="uploadStatus" class="upload-status" :class="uploadStatus.type">
                <span>{{ uploadStatus.icon }} {{ uploadStatus.message }}</span>
              </div>

              <div class="text-paste-section">
                <textarea
                  v-model="pasteContent"
                  placeholder="或者直接粘贴简历文本内容..."
                  rows="6"
                ></textarea>
                <el-button type="primary" @click="analyzeText" :loading="isAnalyzing">
                  AI解析文本内容
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="在线制作简历" name="create">
            <div class="create-section">
              <el-form :model="resumeForm" label-width="120px">
                <el-form-item label="姓名">
                  <el-input v-model="resumeForm.name" />
                </el-form-item>
                <el-form-item label="学历">
                  <el-select v-model="resumeForm.education">
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士" value="硕士" />
                    <el-option label="博士" value="博士" />
                    <el-option label="大专" value="大专" />
                  </el-select>
                </el-form-item>
                <el-form-item label="专业">
                  <el-input v-model="resumeForm.major" />
                </el-form-item>
                <el-form-item label="毕业年份">
                  <el-input v-model="resumeForm.graduationYear" placeholder="如：2026" />
                </el-form-item>
                <el-form-item label="求职意向">
                  <el-input v-model="resumeForm.intent" />
                </el-form-item>
                <el-form-item label="个人简介">
                  <el-input v-model="resumeForm.summary" type="textarea" :rows="3" />
                </el-form-item>

                <el-form-item label="实习经历">
                  <div v-for="(exp, idx) in resumeForm.experience" :key="idx" class="exp-item">
                    <el-input v-model="exp.company" placeholder="公司名称" />
                    <el-input v-model="exp.position" placeholder="职位" />
                    <el-input v-model="exp.duration" placeholder="时间" />
                    <el-input v-model="exp.description" type="textarea" placeholder="工作职责" :rows="2" />
                    <el-button type="danger" size="small" @click="removeExp(idx)">删除</el-button>
                  </div>
                  <el-button link @click="addExp">+ 添加实习经历</el-button>
                </el-form-item>

                <el-form-item label="项目经验">
                  <div v-for="(proj, idx) in resumeForm.projects" :key="idx" class="exp-item">
                    <el-input v-model="proj.name" placeholder="项目名称" />
                    <el-input v-model="proj.role" placeholder="担任角色" />
                    <el-input v-model="proj.description" type="textarea" placeholder="项目描述" :rows="2" />
                    <el-button type="danger" size="small" @click="removeProj(idx)">删除</el-button>
                  </div>
                  <el-button link @click="addProj">+ 添加项目经验</el-button>
                </el-form-item>

                <el-form-item label="技能特长">
                  <el-tag
                    v-for="(skill, idx) in resumeForm.skills"
                    :key="idx"
                    closable
                    @close="removeSkill(idx)"
                  >{{ skill }}</el-tag>
                  <el-input
                    v-model="newSkill"
                    placeholder="输入技能后回车添加"
                    @keyup.enter="addSkill"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="saveResume">保存简历</el-button>
                  <el-button @click="previewResume">预览简历</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane label="简历管理" name="manage">
            <div class="manage-section">
              <div v-if="resumes.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <p>暂无简历，快去创建或上传一份吧</p>
              </div>
              <div v-else class="resumes-list">
                <div v-for="resume in resumes" :key="resume.id" class="resume-item">
                  <div class="resume-info">
                    <span class="resume-name">{{ resume.name || '未命名' }}的简历</span>
                    <span class="resume-date">{{ formatDate(resume.created_at) }}</span>
                  </div>
                  <div class="resume-actions">
                    <el-button link @click="previewResumeDetail(resume)">预览</el-button>
                    <el-button link @click="downloadResume(resume)">下载</el-button>
                    <el-button link @click="editResume(resume)">编辑</el-button>
                    <el-button type="danger" text @click="deleteResume(resume)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 简历预览弹窗 -->
    <el-dialog v-model="showPreview" title="简历预览" width="800px">
      <div class="preview-content" v-if="previewData">
        <h2 style="text-align: center; margin-bottom: 20px;">{{ previewData.name || '未命名' }}的简历</h2>
        <div class="preview-section">
          <h3>基本信息</h3>
          <p>学历：{{ previewData.education || '未填写' }} | 专业：{{ previewData.major || '未填写' }} | 毕业年份：{{ previewData.graduationYear || '未填写' }}</p>
          <p>求职意向：{{ previewData.intent || '未填写' }}</p>
        </div>
        <div class="preview-section">
          <h3>个人简介</h3>
          <p>{{ previewData.summary || '未填写' }}</p>
        </div>
        <div class="preview-section" v-if="previewData.experience?.length">
          <h3>实习经历</h3>
          <div v-for="exp in previewData.experience" :key="exp.company">
            <p><strong>{{ exp.company }} - {{ exp.position }}</strong> ({{ exp.duration }})</p>
            <p>{{ exp.description }}</p>
          </div>
        </div>
        <div class="preview-section" v-if="previewData.projects?.length">
          <h3>项目经验</h3>
          <div v-for="proj in previewData.projects" :key="proj.name">
            <p><strong>{{ proj.name }}</strong> - {{ proj.role }}</p>
            <p>{{ proj.description }}</p>
          </div>
        </div>
        <div class="preview-section" v-if="previewData.skills?.length">
          <h3>技能特长</h3>
          <el-tag v-for="skill in previewData.skills" :key="skill" style="margin: 4px;">{{ skill }}</el-tag>
        </div>
      </div>
      <template #footer>
        <el-button @click="showPreview = false">关闭</el-button>
        <el-button type="primary" @click="downloadResume(previewData)">下载</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { aiService } from '@/utils/aiService'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url'

const route = useRoute()
const userStore = useUserStore()
const activeTab = ref('upload')
const pasteContent = ref('')
const newSkill = ref('')
const showPreview = ref(false)
const previewData = ref(null)
const fileInput = ref(null)
const isDragOver = ref(false)
const isAnalyzing = ref(false)
const uploadStatus = ref(null)

const resumeForm = reactive({
  name: '',
  education: '',
  major: '',
  graduationYear: '',
  intent: '',
  summary: '',
  experience: [],
  projects: [],
  skills: []
})

const resumes = ref([])

// 加载已保存的简历
onMounted(() => {
  const saved = userStore.loadResumes()
  if (saved && saved.length > 0) {
    // 按创建时间倒序排列
    resumes.value = saved.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  // 从URL参数读取标签页
  const tabParam = route.query.tab
  if (tabParam && ['upload', 'create', 'manage'].includes(tabParam)) {
    activeTab.value = tabParam
  }

  // 从localStorage读取要编辑的简历ID
  const editId = localStorage.getItem('edit_resume_id')
  if (editId) {
    localStorage.removeItem('edit_resume_id')
    const target = resumes.value.find(r => r.id === editId)
    if (target) {
      Object.assign(resumeForm, JSON.parse(JSON.stringify(target)))
      activeTab.value = 'create'
    }
  }
})

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleDrop = (e) => {
  isDragOver.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

const handleFileUpload = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    processFile(files[0])
  }
  // 重置input以允许重复选择同一文件
  e.target.value = ''
}

const processFile = async (file) => {
  uploadStatus.value = { type: 'info', icon: '⏳', message: `正在读取 ${file.name}...` }

  try {
    let text = ''

    // 根据文件类型读取内容
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      text = await readFileAsText(file)
    } else if (file.type.includes('image') || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name)) {
      // 图片文件：提示用户使用文本粘贴方式
      uploadStatus.value = { type: 'warning', icon: '⚠️', message: '图片格式简历暂不支持OCR识别，建议将内容粘贴到下方文本框中进行AI解析' }
      return
    } else if (file.type.includes('pdf') || file.name.endsWith('.pdf')) {
      // PDF文件：使用 pdfjs 解析
      text = await readPDFFile(file)
      if (!text || text.trim().length < 10) {
        uploadStatus.value = { type: 'warning', icon: '⚠️', message: 'PDF文件无法提取文字。建议将简历内容粘贴到下方文本框中进行AI解析' }
        return
      }
    } else if (/\.(doc|docx)$/i.test(file.name)) {
      // Word文件：尝试读取
      text = await readFileAsText(file)
      if (!text || text.trim().length < 10) {
        uploadStatus.value = { type: 'warning', icon: '⚠️', message: 'Word文件无法直接解析，建议将简历内容复制粘贴到下方文本框中进行AI解析' }
        return
      }
    } else {
      text = await readFileAsText(file)
    }

    if (!text || text.trim().length < 5) {
      uploadStatus.value = { type: 'error', icon: '❌', message: '无法读取文件内容，请将简历内容粘贴到下方文本框中' }
      return
    }

    uploadStatus.value = { type: 'info', icon: '🤖', message: 'AI正在解析简历内容...' }

    const result = await aiService.analyzeResume(text)

    let parsedData
    try {
      parsedData = JSON.parse(result)
    } catch {
      parsedData = parseResumeFromText(text)
    }

    const parsedResume = {
      id: Date.now().toString(),
      name: parsedData.name || '未识别姓名',
      education: parsedData.education || '未识别学历',
      major: parsedData.major || '未识别专业',
      graduationYear: parsedData.graduationYear || '',
      intent: parsedData.intent || '未识别求职意向',
      summary: parsedData.summary || '',
      experience: parsedData.experience?.map(exp => {
        if (typeof exp === 'string') {
          return { company: exp, position: '', duration: '', description: exp }
        }
        return { company: exp.company || '', position: exp.position || '', duration: exp.duration || '', description: exp.description || '' }
      }) || [],
      projects: parsedData.projects?.map(proj => {
        if (typeof proj === 'string') {
          return { name: proj, role: '', description: '' }
        }
        return { name: proj.name || '', role: proj.role || '', description: proj.description || '' }
      }) || [],
      skills: parsedData.skills || [],
      created_at: new Date().toISOString()
    }

    // 保存到localStorage
    const allResumes = userStore.loadResumes()
    allResumes.push(parsedResume)
    userStore.saveResumes(allResumes)
    // 按创建时间倒序排列
    resumes.value = allResumes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    uploadStatus.value = { type: 'success', icon: '✅', message: '简历解析成功！已保存到简历管理' }
    ElMessage.success('简历解析成功！')

    setTimeout(() => {
      activeTab.value = 'manage'
    }, 1000)
  } catch (error) {
    console.error('简历解析失败:', error)
    uploadStatus.value = { type: 'error', icon: '❌', message: '简历解析失败，请尝试将内容粘贴到文本框中解析' }
    ElMessage.error('简历解析失败，请重试')
  }
}

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// 配置PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
} catch (e) {
  // Worker 配置失败则使用无worker模式
  console.warn('PDF.js worker 配置失败:', e)
}

// 解析PDF文件 - 使用PDF.js提取文本
const readPDFFile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    let text = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str || '').join(' ')
        text += pageText + '\n'
      } catch (e) {
        console.warn(`PDF第${i}页文本提取失败:`, e)
      }
    }

    return text.trim() || ''
  } catch (e) {
    console.error('PDF解析失败:', e)
    return ''
  }
}

const parseResumeFromText = (text) => {
  const result = {
    name: '',
    education: '',
    major: '',
    experience: [],
    projects: [],
    skills: [],
    intent: '',
    summary: ''
  }

  // 姓名 - 多种格式匹配
  const namePatterns = [/姓名[\s：:]*([一-龥]{2,4})/, /名字[\s：:]*([一-龥]{2,4})/, /我是([一-龥]{2,4})/, /本人([一-龥]{2,4})/, /^\s*([一-龥]{2,4})\s*$/m]
  for (const p of namePatterns) { const m = text.match(p); if (m) { result.name = m[1]; break } }

  const eduMatch = text.match(/(博士|硕士|本科|大专)/)
  if (eduMatch) result.education = eduMatch[1]

  // 专业
  const majorMatch = text.match(/(?:专业|主修)[\s：:]*([一-龥\w]+)/)
  if (majorMatch) result.major = majorMatch[1]

  // 毕业年份
  const yrMatch = text.match(/(?:毕业|届)[\s：:]*(\d{4})/)
  if (yrMatch) result.graduationYear = yrMatch[1]

  // 技能 - 扩展库
  const skillList = ['JavaScript','TypeScript','Python','Java','Go','Rust','C\\+\\+','C#','PHP','Ruby','Kotlin','Swift','Vue','React','Angular','Node\\.js','Express','Spring','Django','Flask','SQL','MySQL','PostgreSQL','MongoDB','Redis','HTML','CSS','SASS','Webpack','Vite','Docker','Kubernetes','AWS','Azure','Git','Figma','Linux','机器学习','深度学习','数据分析','TensorFlow','PyTorch','NLP','LLM','RAG']
  const found = []
  for (const s of skillList) { if (new RegExp(s, 'i').test(text)) found.push(s.replace(/\\./g, '.').replace(/\\\\/g, '')) }
  if (found.length) result.skills = [...new Set(found)]

  // 求职意向
  const intentPatterns = [/求职意向[\s：:]*(.{2,20}?)(?:\n|$)/, /应聘岗位[\s：:]*(.{2,20}?)(?:\n|$)/, /期望职位[\s：:]*(.{2,20}?)(?:\n|$)/]
  for (const p of intentPatterns) { const m = text.match(p); if (m) { result.intent = m[1].trim(); break } }

  // 个人简介
  const summaryMatch = text.match(/(?:个人简介|自我介绍|个人优势|自我评价)[\s：:]*([\s\S]{20,300}?)(?:\n\n|\n#|$)/)
  if (summaryMatch) result.summary = summaryMatch[1].trim()

  return result
}

const analyzeText = async () => {
  if (!pasteContent.value.trim()) {
    ElMessage.warning('请输入简历内容')
    return
  }

  isAnalyzing.value = true

  try {
    const result = await aiService.analyzeResume(pasteContent.value)

    let parsedData
    try {
      parsedData = JSON.parse(result)
    } catch {
      parsedData = parseResumeFromText(pasteContent.value)
    }

    resumeForm.name = parsedData.name || ''
    resumeForm.education = parsedData.education || ''
    resumeForm.major = parsedData.major || ''
    resumeForm.intent = parsedData.intent || ''
    resumeForm.summary = parsedData.summary || ''
    resumeForm.skills = parsedData.skills || []

    if (parsedData.experience && parsedData.experience.length > 0) {
      resumeForm.experience = parsedData.experience.map(exp => {
        if (typeof exp === 'string') {
          return { company: exp, position: '', duration: '', description: exp }
        }
        return { company: exp.company || '', position: exp.position || '', duration: exp.duration || '', description: exp.description || '' }
      })
    }

    if (parsedData.projects && parsedData.projects.length > 0) {
      resumeForm.projects = parsedData.projects.map(proj => {
        if (typeof proj === 'string') {
          return { name: proj, role: '', description: '' }
        }
        return { name: proj.name || '', role: proj.role || '', description: proj.description || '' }
      })
    }

    ElMessage.success('AI解析完成！请在表单中确认和修改')
    activeTab.value = 'create'
  } catch (error) {
    console.error('AI解析失败:', error)
    ElMessage.error('AI解析失败，请重试')
  } finally {
    isAnalyzing.value = false
  }
}

const addExp = () => {
  resumeForm.experience.push({ company: '', position: '', duration: '', description: '' })
}

const removeExp = (idx) => {
  resumeForm.experience.splice(idx, 1)
}

const addProj = () => {
  resumeForm.projects.push({ name: '', role: '', description: '' })
}

const removeProj = (idx) => {
  resumeForm.projects.splice(idx, 1)
}

const addSkill = () => {
  if (newSkill.value.trim() && !resumeForm.skills.includes(newSkill.value.trim())) {
    resumeForm.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (idx) => {
  resumeForm.skills.splice(idx, 1)
}

const saveResume = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  if (!resumeForm.name) {
    return ElMessage.warning('请填写姓名')
  }

  const newResume = {
    id: Date.now().toString(),
    ...JSON.parse(JSON.stringify(resumeForm)),
    created_at: new Date().toISOString()
  }

  const allResumes = userStore.loadResumes()
  allResumes.push(newResume)
  userStore.saveResumes(allResumes)
  // 按创建时间倒序排列
  resumes.value = allResumes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  ElMessage.success('简历保存成功！')
  activeTab.value = 'manage'
}

const previewResume = () => {
  previewData.value = { ...resumeForm }
  showPreview.value = true
}

const previewResumeDetail = (resume) => {
  previewData.value = resume
  showPreview.value = true
}

const downloadResume = (resume) => {
  let content = `${resume.name || '未命名'}的简历\n\n`
  content += `基本信息\n`
  content += `学历：${resume.education || '未填写'}\n`
  content += `专业：${resume.major || '未填写'}\n`
  content += `毕业年份：${resume.graduationYear || '未填写'}\n`
  content += `求职意向：${resume.intent || '未填写'}\n\n`

  content += `个人简介\n`
  content += `${resume.summary || '未填写'}\n\n`

  if (resume.experience && resume.experience.length) {
    content += `实习经历\n`
    resume.experience.forEach(exp => {
      content += `${exp.company || ''} - ${exp.position || ''} (${exp.duration || ''})\n`
      content += `${exp.description || ''}\n\n`
    })
  }

  if (resume.projects && resume.projects.length) {
    content += `项目经验\n`
    resume.projects.forEach(proj => {
      content += `${proj.name || ''} - ${proj.role || ''}\n`
      content += `${proj.description || ''}\n\n`
    })
  }

  if (resume.skills && resume.skills.length) {
    content += `技能特长\n`
    content += resume.skills.join(' | ') + '\n'
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${resume.name || '简历'}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success('简历已下载')
}

const editResume = (resume) => {
  Object.assign(resumeForm, JSON.parse(JSON.stringify(resume)))
  activeTab.value = 'create'
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

const formatDate = (date) => {
  if (!date) return '未知'
  try {
    return new Date(date).toLocaleDateString('zh-CN')
  } catch {
    return date
  }
}
</script>

<style scoped>
.resume-page {
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

.tab-switch {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.upload-area {
  border: 2px dashed #bfdbfe;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #eff6ff;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #2563eb;
  background: #dbeafe;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-area p {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.upload-tips {
  font-size: 13px;
  color: #999 !important;
}

.upload-status {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.upload-status.info {
  background: #eff6ff;
  color: #1e40af;
}

.upload-status.success {
  background: #f0fdf4;
  color: #166534;
}

.upload-status.warning {
  background: #fffbeb;
  color: #92400e;
}

.upload-status.error {
  background: #fef2f2;
  color: #991b1b;
}

.text-paste-section {
  margin-top: 24px;
}

.text-paste-section textarea {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: vertical;
  font-size: 14px;
}

.text-paste-section .el-button {
  margin-top: 12px;
}

.create-section {
  max-width: 800px;
  margin: 0 auto;
}

.exp-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.resumes-list {
  max-width: 800px;
  margin: 0 auto;
}

.resume-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.resume-info {
  display: flex;
  flex-direction: column;
}

.resume-name {
  font-size: 15px;
  font-weight: 500;
}

.resume-date {
  font-size: 13px;
  color: #999;
}

.resume-actions {
  display: flex;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
}

.preview-content {
  max-height: 600px;
  overflow-y: auto;
}

.preview-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.preview-section:last-child {
  border-bottom: none;
}

.preview-section h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2563eb;
}
</style>

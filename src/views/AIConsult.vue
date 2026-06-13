<template>
  <div class="ai-consult-page">
    <div class="container">
      <!-- 左侧对话区 -->
      <div class="chat-section">
        <div class="chat-header">
          <div class="header-top">
            <div>
              <h2>🎯 AI职业规划顾问</h2>
              <p class="subtitle">帮你梳理职业方向，解答求职疑惑</p>
            </div>
            <el-button type="warning" plain size="small" @click="clearConversation">🔄 新话题</el-button>
          </div>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-state">
            <div class="empty-icon">🤖</div>
            <p>你好！我是AI职业规划顾问</p>
            <p>有什么求职问题都可以问我哦~</p>
            <div class="quick-questions">
              <span @click="sendQuickQuestion('我想找前端开发的工作，需要准备什么？')">前端开发求职</span>
              <span @click="sendQuickQuestion('如何写一份好的简历？')">简历优化</span>
              <span @click="sendQuickQuestion('面试有什么技巧？')">面试技巧</span>
            </div>
          </div>

          <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
            <div class="message-avatar">
              {{ msg.role === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMarkdown(msg.content)"></div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
          </div>

          <div v-if="isLoading" class="message assistant loading">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="2"
            placeholder="输入你的问题..."
            @keydown.enter.ctrl="sendMessage"
          />
          <el-button type="primary" :loading="isLoading" @click="sendMessage">
            发送
          </el-button>
        </div>
      </div>

      <!-- 右侧标签看板 -->
      <div class="sidebar">
        <div class="career-tags">
          <div class="sidebar-header">
            <h3>🏷️ 职业标签看板</h3>
            <el-button type="primary" size="small" text @click="showTagEditor = true">✏️ 编辑</el-button>
          </div>
          <div class="tag-group">
            <h4>求职意向</h4>
            <div class="tags">
              <el-tag v-for="tag in careerTags.intent" :key="tag" effect="light" round>{{ tag }}</el-tag>
              <span v-if="careerTags.intent.length === 0" class="empty-tip">点击编辑添加</span>
            </div>
          </div>
          <div class="tag-group">
            <h4>技能方向</h4>
            <div class="tags">
              <el-tag v-for="tag in careerTags.skills" :key="tag" type="success" effect="light" round>{{ tag }}</el-tag>
              <span v-if="careerTags.skills.length === 0" class="empty-tip">点击编辑添加</span>
            </div>
          </div>
          <div class="tag-group">
            <h4>关注行业</h4>
            <div class="tags">
              <el-tag v-for="tag in careerTags.industry" :key="tag" type="warning" effect="light" round>{{ tag }}</el-tag>
              <span v-if="careerTags.industry.length === 0" class="empty-tip">点击编辑添加</span>
            </div>
          </div>
        </div>

        <!-- 标签编辑弹窗 -->
        <el-dialog title="编辑职业标签" v-model="showTagEditor" width="500px">
          <div class="tag-editor">
            <div class="editor-group">
              <h4>求职意向</h4>
              <div class="tag-input-area">
                <el-input v-model="newTags.intent" placeholder="输入后按回车添加" @keyup.enter="addTag('intent')" />
                <el-button type="primary" size="small" @click="addTag('intent')">添加</el-button>
              </div>
              <div class="preset-tags">
                <span class="preset-label">推荐：</span>
                <el-tag
                  v-for="tag in presetTags.intent"
                  :key="tag"
                  size="small"
                  effect="plain"
                  class="preset-tag"
                  :class="{ 'preset-tag-added': careerTags.intent.includes(tag) }"
                  @click="addPresetTag('intent', tag)"
                >{{ tag }}</el-tag>
              </div>
              <div class="tag-list">
                <el-tag
                  v-for="(tag, index) in careerTags.intent"
                  :key="tag"
                  closable
                  @close="removeTag('intent', index)"
                >{{ tag }}</el-tag>
              </div>
            </div>

            <div class="editor-group">
              <h4>技能方向</h4>
              <div class="tag-input-area">
                <el-input v-model="newTags.skills" placeholder="输入后按回车添加" @keyup.enter="addTag('skills')" />
                <el-button type="primary" size="small" @click="addTag('skills')">添加</el-button>
              </div>
              <div class="preset-tags">
                <span class="preset-label">推荐：</span>
                <el-tag
                  v-for="tag in presetTags.skills"
                  :key="tag"
                  size="small"
                  effect="plain"
                  class="preset-tag"
                  :class="{ 'preset-tag-added': careerTags.skills.includes(tag) }"
                  @click="addPresetTag('skills', tag)"
                >{{ tag }}</el-tag>
              </div>
              <div class="tag-list">
                <el-tag
                  v-for="(tag, index) in careerTags.skills"
                  :key="tag"
                  type="success"
                  closable
                  @close="removeTag('skills', index)"
                >{{ tag }}</el-tag>
              </div>
            </div>

            <div class="editor-group">
              <h4>关注行业</h4>
              <div class="tag-input-area">
                <el-input v-model="newTags.industry" placeholder="输入后按回车添加" @keyup.enter="addTag('industry')" />
                <el-button type="primary" size="small" @click="addTag('industry')">添加</el-button>
              </div>
              <div class="preset-tags">
                <span class="preset-label">推荐：</span>
                <el-tag
                  v-for="tag in presetTags.industry"
                  :key="tag"
                  size="small"
                  effect="plain"
                  class="preset-tag"
                  :class="{ 'preset-tag-added': careerTags.industry.includes(tag) }"
                  @click="addPresetTag('industry', tag)"
                >{{ tag }}</el-tag>
              </div>
              <div class="tag-list">
                <el-tag
                  v-for="(tag, index) in careerTags.industry"
                  :key="tag"
                  type="warning"
                  closable
                  @close="removeTag('industry', index)"
                >{{ tag }}</el-tag>
              </div>
            </div>
          </div>
          <template #footer>
            <el-button @click="showTagEditor = false">关闭</el-button>
            <el-button type="primary" @click="saveTags">保存</el-button>
          </template>
        </el-dialog>

        <!-- 对话历史 -->
        <div class="conv-history" v-if="conversationHistory.length > 0">
          <h3>📚 历史对话</h3>
          <div class="conv-list">
            <div v-for="conv in conversationHistory.slice(0, 5)" :key="conv.id" class="conv-item">
              <span class="conv-title" @click="loadConversation(conv)" :title="conv.title">{{ conv.title }}</span>
              <span class="conv-time">{{ conv.time.slice(5) }}</span>
              <el-button type="danger" text size="small" @click.stop="deleteConversation(conv.id)">🗑</el-button>
            </div>
          </div>
        </div>

        <div class="test-links">
          <h3>🔗 职业测评工具</h3>
          <p class="tips">以下为第三方测评工具，点击跳转</p>
          <div class="link-list">
            <a v-for="link in testLinks" :key="link.name" :href="link.url" target="_blank" class="link-item">
              <span class="link-icon">{{ link.icon }}</span>
              <span class="link-name">{{ link.name }}</span>
              <span class="link-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { aiService } from '@/utils/aiService'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatMarkdown } from '@/utils/markdown'

const userStore = useUserStore()
const messagesContainer = ref(null)
const inputMessage = ref('')
const messages = ref([])
const isLoading = ref(false)

// 标签编辑器相关
const showTagEditor = ref(false)
const newTags = ref({
  intent: '',
  skills: '',
  industry: ''
})

// 预设标签建议
const presetTags = {
  intent: ['前端开发', '后端开发', '全栈工程师', '产品经理', '数据分析师', 'UI设计师', '测试工程师', '算法工程师', '运营专员'],
  skills: ['Vue', 'React', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Node.js', 'SQL', 'Figma'],
  industry: ['互联网', '金融科技', '人工智能', '电子商务', '教育培训', '医疗健康', '游戏娱乐', '新能源']
}

// 职业标签
const careerTags = ref({
  intent: ['前端开发', '全栈工程师'],
  skills: ['Vue', 'React', 'Node.js', 'TypeScript'],
  industry: ['互联网', '金融科技', '企业服务']
})

// 添加标签
const addTag = (type) => {
  const value = newTags.value[type].trim()
  if (!value) return

  if (!careerTags.value[type].includes(value)) {
    careerTags.value[type].push(value)
    newTags.value[type] = ''
    ElMessage.success('标签添加成功')
  } else {
    ElMessage.warning('标签已存在')
  }
}

// 通过预设标签添加
const addPresetTag = (type, tag) => {
  if (!careerTags.value[type].includes(tag)) {
    careerTags.value[type].push(tag)
    ElMessage.success('标签添加成功')
  } else {
    ElMessage.warning('标签已存在')
  }
}

// 删除标签
const removeTag = (type, index) => {
  careerTags.value[type].splice(index, 1)
}

// 保存标签
const saveTags = () => {
  try {
    userStore.saveCareerTags(careerTags.value)
    showTagEditor.value = false
    ElMessage.success('标签保存成功')
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

// 测评链接
const testLinks = [
  { name: '霍兰德职业兴趣测试', icon: '🧠', url: 'https://www.apesk.com/holland/index.html' },
  { name: 'MBTI性格测试', icon: '🎭', url: 'https://www.16personalities.com/ch' },
  { name: 'DISC性格测试', icon: '📊', url: 'https://www.apesk.com/disc/index.asp' }
]

// 加载历史对话
onMounted(() => {
  const saved = userStore.loadAIChat()
  if (saved && saved.length > 0) {
    messages.value = saved
    scrollToBottom()
  }
  const savedTags = userStore.loadCareerTags()
  if (savedTags) careerTags.value = savedTags
  loadConversationHistory()
})

// 发送消息（流式输出）
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再使用AI咨询功能')
    return
  }

  const userMessage = {
    role: 'user',
    content: inputMessage.value.trim(),
    time: new Date().toLocaleTimeString()
  }

  messages.value.push(userMessage)
  inputMessage.value = ''
  isLoading.value = true

  await nextTick()
  scrollToBottom()

  // 创建空的助手消息用于流式追加
  const assistantIdx = messages.value.length
  messages.value.push({ role: 'assistant', content: '', time: new Date().toLocaleTimeString() })

  try {
    const history = messages.value
      .filter(m => m.role !== 'user' || m !== userMessage)
      .slice(0, -1) // exclude the empty assistant message
      .map(m => ({ role: m.role, content: m.content }))

    // 构建system prompt
    const fullMessages = [
      { role: 'system', content: '你是专业的职业规划咨询师，擅长帮应届生梳理方向、解答求职疑惑。请用友好专业的语气回答，适当使用表情符号。' },
      ...history,
      { role: 'user', content: userMessage.content }
    ]

    await aiService.chatStream(fullMessages, (chunk) => {
      messages.value[assistantIdx].content += chunk
      nextTick(() => scrollToBottom())
    })

    userStore.saveAIChat(messages.value)
  } catch (error) {
    console.error('AI调用失败:', error)
    messages.value[assistantIdx].content = '抱歉，AI服务暂时不可用，请稍后再试。'
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// 开启新话题（保存当前对话到历史，清空当前对话）
const conversationHistory = ref([]) // { id, title, messages, time }

const loadConversationHistory = () => {
  if (!userStore.isLoggedIn) return
  const saved = localStorage.getItem(`offer_catcher_conv_hist_${userStore.user.id}`)
  conversationHistory.value = saved ? JSON.parse(saved) : []
}
const saveConversationHistory = () => {
  if (!userStore.isLoggedIn) return
  localStorage.setItem(`offer_catcher_conv_hist_${userStore.user.id}`, JSON.stringify(conversationHistory.value))
}

const clearConversation = () => {
  if (messages.value.length === 0) {
    ElMessage.info('当前没有对话内容')
    return
  }
  ElMessageBox.confirm('确定要开启新话题吗？当前对话将保存到历史记录。', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'
  }).then(() => {
    // 保存当前对话到历史
    const title = messages.value.find(m => m.role === 'user')?.content?.slice(0, 30) || '新对话'
    conversationHistory.value.unshift({
      id: Date.now(),
      title: title + (title.length >= 30 ? '...' : ''),
      messages: JSON.parse(JSON.stringify(messages.value)),
      time: new Date().toLocaleString()
    })
    // 只保留最近20条
    if (conversationHistory.value.length > 20) conversationHistory.value.length = 20
    saveConversationHistory()
    messages.value = []
    userStore.saveAIChat([])
    ElMessage.success('已开启新话题，旧对话已保存')
  }).catch(() => {})
}

const loadConversation = (conv) => {
  if (messages.value.length > 0) {
    ElMessageBox.confirm('加载历史对话会替换当前对话，确定继续？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' })
      .then(() => {
        messages.value = JSON.parse(JSON.stringify(conv.messages))
        scrollToBottom()
        ElMessage.success('已加载历史对话')
      }).catch(() => {})
  } else {
    messages.value = JSON.parse(JSON.stringify(conv.messages))
    scrollToBottom()
    ElMessage.success('已加载历史对话')
  }
}

const deleteConversation = (convId) => {
  conversationHistory.value = conversationHistory.value.filter(c => c.id !== convId)
  saveConversationHistory()
  ElMessage.success('已删除')
}

// 快捷问题
const sendQuickQuestion = (question) => {
  inputMessage.value = question
  sendMessage()
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 格式化消息（支持Markdown）
const formatMessage = (content) => {
  if (!content) return ''

  let html = content

  // 处理代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; overflow-x: auto; font-family: 'Consolas', 'Monaco', monospace; font-size: 13px; margin: 8px 0;"><code>${code.trim()}</code></pre>`
  })

  // 处理行内代码
  html = html.replace(/`([^`]+)`/g, '<code style="background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">$1</code>')

  // 处理粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')

  // 处理斜体
  html = html.replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>')

  // 逐行处理列表和普通文本
  const lines = html.split('\n')
  const processedLines = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 检测无序列表项
    if (/^(\s*[-*+])\s+/.test(line)) {
      if (!inList) {
        processedLines.push('<ul style="margin: 8px 0; padding-left: 24px;">')
        inList = true
      }
      processedLines.push(`<li style="margin: 4px 0;">${line.replace(/^(\s*[-*+])\s+/, '')}</li>`)
    } else {
      if (inList) {
        processedLines.push('</ul>')
        inList = false
      }
      processedLines.push(line)
    }
  }

  if (inList) {
    processedLines.push('</ul>')
  }

  html = processedLines.join('\n')

  // 处理有序列表
  html = html.replace(/^(\d+)\.\s+/gm, '<li>$1. ')
  html = html.replace(/(<li>\d+\.\s.+?)(?=\n<li>\d+\.\s|\n\n|$)/gs, '<ol style="margin: 8px 0; padding-left: 28px;">$1</li></ol>')

  // 处理链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #2563eb; text-decoration: underline;">$1</a>')

  // 处理换行（在非块级元素中）
  html = html.replace(/\n(?!<\/li>|<\/ul>|<\/ol>|<\/pre>)/g, '<br>')

  // 处理标题（在换行之后，避免被段落包裹）
  html = html.replace(/^(#{1})\s*(.+)$/gm, '<h1 style="font-size: 24px; font-weight: 700; color: #1f2937; margin: 16px 0 8px;">$2</h1>')
  html = html.replace(/^(#{2})\s*(.+)$/gm, '<h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 14px 0 6px;">$2</h2>')
  html = html.replace(/^(#{3})\s*(.+)$/gm, '<h3 style="font-size: 18px; font-weight: 600; color: #374151; margin: 12px 0 6px;">$2</h3>')
  html = html.replace(/^(#{4})\s*(.+)$/gm, '<h4 style="font-size: 16px; font-weight: 600; color: #4b5563; margin: 10px 0 4px;">$2</h4>')

  // 处理段落：只对非块级元素内容包裹 <p> 标签
  // 先将块级元素用占位符保护，避免被 <p> 包裹
  const blockPattern = /(<h[1-4][ >]|<pre[ >]|<ul[ >]|<ol[ >])/
  const parts = html.split(/(<\/h[1-4]>|<\/pre>|<\/ul>|<\/ol>)/)

  let result = ''
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      // 奇数位是块级元素的关闭标签，直接拼接
      result += parts[i]
    } else {
      // 偶数位是内容部分
      let segment = parts[i]
      // 检查这段内容是否以块级元素开头
      const startsWithBlock = blockPattern.test(segment.trimStart())
      if (startsWithBlock) {
        result += segment
      } else if (segment.trim()) {
        result += `<p style="margin: 8px 0;">${segment}</p>`
      }
    }
  }

  // 清理 <p> 标签内多余的 <br> 和嵌套 <p>
  result = result.replace(/<p style="margin: 8px 0;">\s*<br>/g, '<p style="margin: 8px 0;">')
  result = result.replace(/<br>\s*<\/p>/g, '</p>')
  result = result.replace(/<p style="margin: 8px 0;">\s*<\/p>/g, '')

  return result
}
</script>

<style scoped>
.ai-consult-page {
  padding-top: 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.container {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.chat-section {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 128px);
}

.chat-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.chat-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #999;
  font-size: 14px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 8px 0;
}

.quick-questions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.quick-questions span {
  padding: 8px 16px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.quick-questions span:hover {
  background: rgba(37, 99, 235, 0.2);
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
}

.message-content {
  max-width: 70%;
}

.message-text {
  padding: 16px;
  border-radius: 16px;
  background: #f5f5f5;
  line-height: 1.6;
  color: #333;
}

.message.user .message-text {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: #fff;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.message.user .message-time {
  text-align: left;
}

.loading-dots {
  display: flex;
  gap: 4px;
  padding: 16px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input-area {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
}

.chat-input-area .el-textarea {
  flex: 1;
}

.sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.career-tags, .test-links {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.career-tags h3, .test-links h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
}

.tag-group {
  margin-bottom: 16px;
}

.tag-group h4 {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 对话历史 */
.conv-history {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.conv-history h3 { font-size: 18px; color: #333; margin-bottom: 12px; }
.conv-list { display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; }
.conv-item { display: flex; align-items: center; gap: 6px; padding: 8px 10px; background: #f8f9fa; border-radius: 8px; }
.conv-title { flex: 1; font-size: 13px; color: #2563eb; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.conv-title:hover { text-decoration: underline; }
.conv-time { font-size: 11px; color: #999; white-space: nowrap; }

.test-links .tips {
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f8f8;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
}

.link-item:hover {
  background: rgba(7, 193, 96, 0.1);
  transform: translateX(4px);
}

.link-icon {
  font-size: 20px;
  margin-right: 12px;
}

.link-name {
  flex: 1;
  font-size: 14px;
}

.link-arrow {
  color: #999;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.sidebar-header h3 {
  margin-bottom: 0;
}

.empty-tip {
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.tag-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.editor-group {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.editor-group h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
}

.tag-input-area {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tag-input-area .el-input {
  flex: 1;
}

.preset-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
  align-items: center;
}

.preset-label {
  font-size: 12px;
  color: #999;
  margin-right: 2px;
}

.preset-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.preset-tag:hover {
  opacity: 0.8;
}

.preset-tag-added {
  opacity: 0.5;
  cursor: default;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 1000px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>
/* AI状态指示器 */
.status-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.status-key { color: #666; }
.status-val { font-weight: 500; color: #333; }
.status-val.ok { color: #16a34a; }
.status-val.err { color: #dc2626; }


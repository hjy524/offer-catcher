<template>
  <div class="chat-history-page">
    <div class="container">
      <div class="page-header">
        <el-button text @click="$router.push('/user')">← 返回个人主页</el-button>
        <h1>💬 AI对话记录</h1>
        <p>查看所有与AI职业顾问的对话历史</p>
      </div>

      <div class="history-content">
        <!-- 搜索和统计 -->
        <div class="toolbar">
          <el-input
            v-model="searchText"
            placeholder="搜索对话内容..."
            clearable
            style="width: 300px"
          >
            <template #prefix>🔍</template>
          </el-input>
          <span class="total-count">共 {{ filteredHistory.length }} 条消息</span>
          <el-button type="danger" plain size="small" @click="clearAll" v-if="chatHistory.length > 0">
            🗑️ 清空记录
          </el-button>
        </div>

        <!-- 对话列表 -->
        <div v-if="filteredHistory.length === 0" class="empty-state">
          <div class="empty-icon">💬</div>
          <p v-if="searchText">没有匹配的对话记录</p>
          <p v-else>暂无对话记录，去<a @click="$router.push('/ai-consult')">AI咨询</a>页面开始对话吧~</p>
        </div>

        <!-- 历史对话分组 -->
        <div v-else>
          <div v-for="(group, gIdx) in groupedHistory" :key="gIdx" class="conversation-group">
            <div v-if="group.title" class="group-header">
              <span class="group-title">📌 {{ group.title }}</span>
              <span class="group-time">{{ group.time }}</span>
            </div>
            <div
              v-for="(msg, idx) in group.messages"
              :key="idx"
              :class="['chat-item', msg.role]"
            >
              <div class="chat-avatar">
                {{ msg.role === 'user' ? '👤' : '🤖' }}
              </div>
              <div class="chat-bubble">
                <div class="chat-role-label">{{ msg.role === 'user' ? '我' : 'AI职业顾问' }}</div>
                <div class="chat-content">{{ msg.content }}</div>
                <div class="chat-time">{{ msg.timestamp || msg.time || '' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const chatHistory = ref([])
const conversationHistory = ref([])
const searchText = ref('')

// 平铺所有消息用于搜索
const allMessages = computed(() => {
  const msgs = [...chatHistory.value]
  conversationHistory.value.forEach(conv => {
    if (conv.messages) msgs.push(...conv.messages)
  })
  return msgs
})

const filteredHistory = computed(() => {
  if (!searchText.value) return allMessages.value
  const q = searchText.value.toLowerCase()
  return allMessages.value.filter(m => m.content && m.content.toLowerCase().includes(q))
})

// 分组显示
const groupedHistory = computed(() => {
  if (searchText.value) {
    // 搜索模式下平铺显示
    return [{ title: '', messages: filteredHistory.value }]
  }

  const groups = []

  // 先添加历史对话
  conversationHistory.value.forEach(conv => {
    if (conv.messages && conv.messages.length > 0) {
      groups.push({
        title: conv.title || '历史对话',
        time: conv.time || '',
        messages: conv.messages
      })
    }
  })

  // 再添加当前对话
  if (chatHistory.value.length > 0) {
    groups.push({
      title: chatHistory.value.length > 0 ? '当前对话' : '',
      time: '',
      messages: chatHistory.value
    })
  }

  return groups
})

const clearAll = () => {
  ElMessageBox.confirm('确定要清空所有AI对话记录吗？', '提示', {
    confirmButtonText: '清空',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    chatHistory.value = []
    userStore.saveAIChat([])
    ElMessage.success('已清空所有对话记录')
  }).catch(() => {})
}

onMounted(() => {
  chatHistory.value = userStore.loadAIChat() || []

  // 加载历史对话记录
  if (userStore.isLoggedIn) {
    try {
      const saved = localStorage.getItem(`offer_catcher_conv_hist_${userStore.user.id}`)
      if (saved) {
        conversationHistory.value = JSON.parse(saved)
      }
    } catch (e) {
      console.warn('加载对话历史失败:', e)
    }
  }
})
</script>

<style scoped>
.chat-history-page {
  padding-top: 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 8px 0 4px;
}

.page-header p {
  color: #999;
  font-size: 14px;
}

.history-content {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.total-count {
  font-size: 13px;
  color: #999;
  margin-left: auto;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
  font-size: 15px;
}

.empty-state a {
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.2s;
}

.chat-item.assistant {
  background: #eff6ff;
}

.chat-avatar {
  font-size: 28px;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
}

.chat-bubble {
  flex: 1;
  min-width: 0;
}

.chat-role-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.chat-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-time {
  font-size: 12px;
  color: #bbb;
  margin-top: 8px;
  text-align: right;
}

.conversation-group {
  margin-bottom: 24px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
}

.group-title {
  font-weight: 500;
}

.group-time {
  font-size: 12px;
  opacity: 0.85;
}

@media (max-width: 600px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar .el-input {
    width: 100% !important;
  }
  .total-count {
    margin-left: 0;
  }
}
</style>

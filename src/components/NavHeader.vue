<template>
  <header class="nav-header">
    <div class="container">
      <div class="nav-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🎯</span>
          <span class="logo-text">Offer捕手</span>
        </div>

        <nav class="nav-menu">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="['nav-item', { active: $route.path === item.path }]"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <div class="nav-right">
          <div v-if="userStore.isLoggedIn" class="user-area">
            <span class="user-name">👋 {{ userStore.user?.username }}</span>
            <router-link to="/user" class="user-avatar">
              {{ userStore.user?.username?.charAt(0)?.toUpperCase() || 'U' }}
            </router-link>
          </div>
          <div v-else class="login-area">
            <el-button type="primary" size="small" round @click="showLoginModal = true">🚀 登录/注册</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录/注册弹窗 -->
    <el-dialog
      v-model="showLoginModal"
      width="420px"
      :close-on-click-modal="false"
      append-to-body
    >
      <template #header>
        <div class="auth-tabs">
          <span
            :class="['auth-tab', { active: authMode === 'login' }]"
            @click="authMode = 'login'"
          >登录</span>
          <span
            :class="['auth-tab', { active: authMode === 'register' }]"
            @click="authMode = 'register'"
          >注册</span>
        </div>
      </template>

      <div class="login-content">
        <div class="login-icon">🎯</div>
        <p class="login-desc">
          {{ authMode === 'login' ? '登录你的账户' : '创建新账户' }}
        </p>
        <el-input
          v-model="authForm.username"
          placeholder="用户名（3-20位，中英文数字下划线）"
          maxlength="20"
          size="large"
          @keyup.enter="handleAuth"
        />
        <el-input
          v-model="authForm.password"
          type="password"
          placeholder="密码（至少4位）"
          size="large"
          show-password
          style="margin-top: 12px"
          @keyup.enter="handleAuth"
        />
        <p v-if="authError" class="login-error">{{ authError }}</p>
        <p class="login-tips">
          {{ authMode === 'login' ? '🔐 输入密码访问你的数据' : '🔏 注册后请牢记密码，目前不支持找回' }}
        </p>
      </div>
      <template #footer>
        <el-button @click="showLoginModal = false">取消</el-button>
        <el-button type="primary" :loading="authLoading" @click="handleAuth">
          {{ authMode === 'login' ? '登录' : '注册' }}
        </el-button>
      </template>
    </el-dialog>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const showLoginModal = ref(false)
const authMode = ref('login') // 'login' | 'register'
const authForm = ref({ username: '', password: '' })
const authError = ref('')
const authLoading = ref(false)

// 切换标签时清空错误
watch(authMode, () => { authError.value = '' })

const navItems = [
  { name: '首页', path: '/' },
  { name: '简历创建', path: '/resume' },
  { name: '岗位匹配', path: '/job-match' },
  { name: '简历诊断', path: '/resume-check' },
  { name: 'AI咨询', path: '/ai-consult' },
  { name: '心路日志', path: '/journal' },
  { name: '笔记社区', path: '/community' },
  { name: '求职干货', path: '/article' }
]

// 初始化用户状态
onMounted(() => {
  try {
    const oldData = localStorage.getItem('offer_catcher_user')
    if (oldData) {
      const parsed = JSON.parse(oldData)
      if (!parsed.username || !parsed.id) {
        localStorage.removeItem('offer_catcher_user')
      }
    }
  } catch (e) {
    localStorage.removeItem('offer_catcher_user')
  }

  userStore.initUser()
})

const handleAuth = async () => {
  const username = authForm.value.username.trim()
  const password = authForm.value.password
  authError.value = ''

  if (!username) { authError.value = '请输入用户名'; return }
  if (username.length < 3 || username.length > 20) { authError.value = '用户名长度需在3-20位之间'; return }
  if (/[^\w一-龥]/.test(username)) { authError.value = '用户名仅支持中英文、数字和下划线'; return }
  if (!password) { authError.value = '请输入密码'; return }
  if (password.length < 4) { authError.value = '密码长度至少4位'; return }

  authLoading.value = true
  try {
    let success = false
    if (authMode.value === 'register') {
      success = await userStore.register(username, password)
    } else {
      success = await userStore.login(username, password)
    }
    if (success) {
      showLoginModal.value = false
      authForm.value = { username: '', password: '' }
    }
  } catch (e) {
    authError.value = '操作失败，请重试'
    console.error('Auth error:', e)
  } finally {
    authLoading.value = false
  }
}
</script>

<style scoped>
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f0f0f0;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  font-size: 32px;
  margin-right: 10px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-item {
  position: relative;
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  border-radius: 20px;
}

.nav-item:hover {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
}

.nav-item.active {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.12);
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-area {
  font-size: 14px;
}

.login-area .el-button {
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.login-content {
  text-align: center;
  padding: 20px 0;
}

.login-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.login-desc {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.login-content .el-input {
  margin-bottom: 8px;
}

.login-error {
  font-size: 13px;
  color: #ef4444;
  margin-bottom: 8px;
}

.login-tips {
  font-size: 13px;
  color: #999;
}

/* 认证标签切换 */
.auth-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
}
.auth-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #999;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}
.auth-tab:hover {
  color: #2563eb;
}
.auth-tab.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}
</style>

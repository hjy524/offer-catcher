import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import { useUserStore } from './stores/user'

// 全局错误处理 - 防止未捕获异常导致页面冻结
window.addEventListener('error', (e) => {
  console.error('[全局错误]', e.message, e.filename, e.lineno)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('[未处理Promise拒绝]', e.reason)
  e.preventDefault()
})

const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue错误]', err, info)
}
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// 初始化用户状态
const userStore = useUserStore()
userStore.initUser()
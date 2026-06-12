import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import { useUserStore } from './stores/user'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// 初始化用户状态
const userStore = useUserStore()
userStore.initUser()
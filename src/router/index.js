import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/resume', name: 'Resume', component: () => import('@/views/Resume.vue') },
  { path: '/job-match', name: 'JobMatch', component: () => import('@/views/JobMatch.vue') },
  { path: '/resume-check', name: 'ResumeCheck', component: () => import('@/views/ResumeCheck.vue') },
  { path: '/ai-consult', name: 'AIConsult', component: () => import('@/views/AIConsult.vue') },
  { path: '/journal', name: 'Journal', component: () => import('@/views/Journal.vue') },
  { path: '/community', name: 'Community', component: () => import('@/views/Community.vue') },
  { path: '/article', name: 'Article', component: () => import('@/views/Article.vue') },
  { path: '/user', name: 'User', component: () => import('@/views/User.vue') },
  { path: '/note/:id', name: 'NoteDetail', component: () => import('@/views/NoteDetail.vue') },
  { path: '/chat-history', name: 'ChatHistory', component: () => import('@/views/ChatHistory.vue') },
  { path: '/diagnose-detail/:index', name: 'DiagnoseDetail', component: () => import('@/views/DiagnoseDetail.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
<template>
  <div class="article-page">
    <div class="container">
      <!-- 分类导航 -->
      <div class="category-nav">
        <span 
          v-for="cat in categories" 
          :key="cat"
          :class="['cat-item', { active: selectedCategory === cat }]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </span>
      </div>
      
      <!-- 文章列表 -->
      <div class="article-list">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id"
          class="article-card"
          @click="openArticle(article)"
        >
          <div class="article-cover" :style="{ backgroundImage: `url(${article.cover})` }"></div>
          <div class="article-content">
            <div class="article-meta">
              <span class="article-category">{{ article.category }}</span>
              <span class="article-date">{{ article.date }}</span>
            </div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-desc">{{ article.summary }}</p>
            <div class="article-footer">
              <span class="article-views">👁️ {{ article.views }}</span>
              <span class="article-likes">{{ isArticleLiked(article.id) ? '❤️' : '👍' }} {{ article.likes }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 文章详情弹窗 -->
      <el-dialog 
        v-model="showDetailModal" 
        :title="currentArticle?.title"
        width="800px"
        class="article-detail-dialog"
      >
        <div v-if="currentArticle" class="article-detail">
          <div class="detail-meta">
            <el-tag size="small" effect="light">{{ currentArticle.category }}</el-tag>
            <span class="detail-date">{{ currentArticle.date }}</span>
            <span class="detail-views">👁️ {{ currentArticle.views }} 阅读</span>
          </div>
          
          <img v-if="currentArticle.cover" :src="currentArticle.cover" class="detail-cover" />
          
          <div class="detail-content" v-html="currentArticle.content"></div>
          
          <div class="detail-actions">
            <el-button :type="isArticleLiked(currentArticle.id) ? 'danger' : 'primary'" round @click="likeArticle">
              {{ isArticleLiked(currentArticle.id) ? '❤️ 已点赞' : '👍 点赞' }} {{ currentArticle.likes }}
            </el-button>
            <el-button round @click="shareArticle">
              🔗 分享
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const categories = ['全部', '简历攻略', '面试技巧', '职业规划', '行业分析', '学习资源']
const selectedCategory = ref('全部')
const showDetailModal = ref(false)
const currentArticle = ref(null)
const userStore = useUserStore()
const likedArticles = ref([])

const articles = ref([
  {
    id: 1,
    title: '2024前端面试高频考点汇总',
    category: '面试技巧',
    summary: '整理了2024年大厂前端面试的高频考点，包括JS基础、框架原理、算法题等...',
    content: `<h3>一、JavaScript基础</h3>
<p><strong>1. 原型链</strong></p>
<p>理解原型链是前端面试的必考题。每个对象都有一个__proto__属性，指向其构造函数的prototype。</p>

<p><strong>2. 闭包</strong></p>
<p>闭包是指有权访问另一个函数作用域中变量的函数。常见应用：数据私有化、函数柯里化。</p>

<p><strong>3. 事件循环</strong></p>
<p>JS是单线程语言，通过事件循环机制处理异步任务。宏任务和微任务的执行顺序是关键考点。</p>

<h3>二、框架原理</h3>
<p><strong>Vue响应式原理</strong></p>
<p>Vue2使用Object.defineProperty实现数据劫持，Vue3改用Proxy，性能更好。</p>

<p><strong>React虚拟DOM</strong></p>
<p>React通过虚拟DOM和Diff算法实现高效更新，Fiber架构实现了任务拆分和优先级调度。</p>

<h3>三、算法题</h3>
<p>高频题目：两数之和、链表反转、二叉树遍历、动态规划等。建议刷LeetCode中等难度题目。</p>`,
    cover: 'https://picsum.photos/600/300?random=10',
    date: '2026-05-20',
    views: 2856,
    likes: 328
  },
  {
    id: 2,
    title: '简历这样写，HR秒回你',
    category: '简历攻略',
    summary: '分享简历优化的核心技巧，用STAR法则描述项目经历，让HR眼前一亮...',
    content: `<h3>一、简历结构</h3>
<p>一份好的简历应该包含以下部分：</p>
<ul>
  <li>个人信息（姓名、联系方式、求职意向）</li>
  <li>教育背景（学校、专业、时间）</li>
  <li>项目经历（重点部分）</li>
  <li>技能清单</li>
</ul>

<h3>二、STAR法则</h3>
<p>用STAR法则描述项目经历：</p>
<ul>
  <li><strong>S（情境）</strong>：项目背景是什么</li>
  <li><strong>T（任务）</strong>：你负责什么</li>
  <li><strong>A（行动）</strong>：你做了什么</li>
  <li><strong>R（结果）</strong>：取得了什么成果</li>
</ul>

<h3>三、注意事项</h3>
<p>1. 简历控制在1-2页</p>
<p>2. 突出与目标岗位相关的经历</p>
<p>3. 用数据说话，量化工作成果</p>`,
    cover: 'https://picsum.photos/600/300?random=11',
    date: '2026-05-18',
    views: 1923,
    likes: 256
  },
  {
    id: 3,
    title: '前端工程师职业发展路径',
    category: '职业规划',
    summary: '从前端小白到技术专家，详解前端工程师的职业发展路径和成长建议...',
    content: `<h3>一、技术路线</h3>
<p><strong>初级工程师（1-2年）</strong></p>
<p>掌握HTML/CSS/JS基础，能独立完成模块开发。</p>

<p><strong>中级工程师（2-4年）</strong></p>
<p>熟练使用框架，了解工程化工具，能主导项目开发。</p>

<p><strong>高级工程师（4-6年）</strong></p>
<p>深入理解框架原理，有架构设计能力，能解决复杂问题。</p>

<p><strong>技术专家（6年+）</strong></p>
<p>在某个领域有深度研究，能引领技术方向。</p>

<h3>二、管理路线</h3>
<p>技术经理 → 技术总监 → CTO</p>

<h3>三、成长建议</h3>
<p>1. 持续学习，保持技术敏感度</p>
<p>2. 多参与开源项目，积累经验</p>
<p>3. 培养软技能，提升沟通能力</p>`,
    cover: 'https://picsum.photos/600/300?random=12',
    date: '2026-05-15',
    views: 1567,
    likes: 189
  },
  {
    id: 4,
    title: '2026互联网行业薪资报告',
    category: '行业分析',
    summary: '最新互联网行业薪资数据分析，了解市场行情，合理定位自己的薪资期望...',
    content: `<h3>一、整体趋势</h3>
<p>2026年互联网行业薪资整体趋于理性，但技术岗位仍有竞争力。</p>

<h3>二、岗位薪资参考</h3>
<p><strong>前端开发</strong></p>
<ul>
  <li>初级：8-15K</li>
  <li>中级：15-25K</li>
  <li>高级：25-40K</li>
</ul>

<p><strong>后端开发</strong></p>
<ul>
  <li>初级：10-18K</li>
  <li>中级：18-30K</li>
  <li>高级：30-50K</li>
</ul>

<h3>三、谈薪技巧</h3>
<p>1. 了解市场行情，合理定位</p>
<p>2. 展示自己的价值</p>
<p>3. 不要只看薪资，综合考虑</p>`,
    cover: 'https://picsum.photos/600/300?random=13',
    date: '2024-03-12',
    views: 2341,
    likes: 312
  }
])

const filteredArticles = computed(() => {
  if (selectedCategory.value === '全部') {
    return articles.value
  }
  return articles.value.filter(a => a.category === selectedCategory.value)
})

const openArticle = (article) => {
  currentArticle.value = article
  article.views++
  showDetailModal.value = true
}

onMounted(async () => {
  likedArticles.value = await userStore.loadLikedArticles()
})

const isArticleLiked = (articleId) => {
  return likedArticles.value.includes(articleId)
}

const likeArticle = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再点赞')
    return
  }
  if (!currentArticle.value) return

  const articleId = currentArticle.value.id
  if (isArticleLiked(articleId)) {
    likedArticles.value = likedArticles.value.filter(id => id !== articleId)
    currentArticle.value.likes--
    ElMessage.success('已取消点赞')
  } else {
    likedArticles.value.push(articleId)
    currentArticle.value.likes++
    ElMessage.success('点赞成功')
  }
  userStore.saveLikedArticles(likedArticles.value)
}

const shareArticle = async () => {
  if (!currentArticle.value) return
  const url = `${window.location.href}#article-${currentArticle.value.id}`
  const text = `${currentArticle.value.title} - ${url}`
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('链接已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.article-page {
  padding-top: 80px;
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.category-nav {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.cat-item {
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.cat-item:hover {
  background: rgba(37, 99, 235, 0.1);
}

.cat-item.active {
  background: #2563eb;
  color: #fff;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-card {
  display: flex;
  gap: 20px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-cover {
  width: 240px;
  height: 160px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.article-content {
  flex: 1;
  padding: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
}

.article-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.article-category {
  padding: 2px 10px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  border-radius: 10px;
  font-size: 12px;
}

.article-date {
  font-size: 12px;
  color: #999;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.article-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  flex: 1;
}

.article-footer {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

/* 详情弹窗 */
.article-detail {
  padding: 0;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-date {
  font-size: 13px;
  color: #999;
}

.detail-views {
  font-size: 13px;
  color: #999;
}

.detail-cover {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}

.detail-content {
  line-height: 1.8;
  color: #333;
}

.detail-content h3 {
  margin: 24px 0 12px;
  color: #333;
}

.detail-content p {
  margin: 8px 0;
}

.detail-content ul {
  padding-left: 20px;
}

.detail-content li {
  margin: 4px 0;
}

.detail-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
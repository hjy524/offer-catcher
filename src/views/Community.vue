<template>
  <div class="community-page">
    <div class="container">
      <!-- 发布按钮 -->
      <div class="publish-bar">
        <el-button type="primary" round @click="showPublishModal = true">
          ✏️ 发布笔记
        </el-button>
        <div class="category-tabs">
          <span
            v-for="cat in categories"
            :key="cat"
            :class="['cat-tab', { active: selectedCategory === cat }]"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </span>
        </div>
      </div>

      <!-- 笔记列表 -->
      <div class="notes-grid">
        <div
          v-for="note in filteredNotes"
          :key="note.id"
          class="note-card"
          @click="$router.push(`/note/${note.id}`)"
        >
          <div class="note-cover" :style="{ backgroundImage: `url(${note.cover})` }">
            <div class="note-overlay">
              <span class="note-category-tag">{{ note.category }}</span>
            </div>
          </div>
          <div class="note-content">
            <div class="note-tag-row">
              <el-tag size="small" effect="dark" class="note-category-badge">{{ note.category }}</el-tag>
            </div>
            <h3 class="note-title">{{ note.title }}</h3>
            <p class="note-desc">{{ note.content.substring(0, 60) }}...</p>
            <div class="note-footer">
              <span class="note-author">
                <span class="author-avatar">{{ (note.author || '?').charAt(0) }}</span>
                {{ note.author }}
              </span>
              <div class="note-stats">
                <span>👍 {{ note.likes }}</span>
                <span>💬 {{ note.comments?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 笔记详情弹窗 -->
      <el-dialog
        v-model="showDetailModal"
        :title="currentNote?.title"
        width="700px"
        class="note-detail-dialog"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        :show-close="true"
        @close="handleDetailClose"
      >
        <div v-if="currentNote" class="note-detail">
          <div class="detail-header">
            <span class="author-avatar large">{{ (currentNote.author || '?').charAt(0) }}</span>
            <div class="author-info">
              <span class="author-name">{{ currentNote.author }}</span>
              <span class="publish-time">{{ currentNote.date }}</span>
            </div>
            <el-tag size="small" effect="light">{{ currentNote.category }}</el-tag>
          </div>

          <div class="detail-content">
            <img v-if="currentNote.cover" :src="currentNote.cover" class="detail-cover" />
            <p class="detail-text">{{ currentNote.content }}</p>
          </div>

          <div class="detail-actions">
            <el-button
              :type="isLiked(currentNote.id) ? 'primary' : 'default'"
              round
              @click="toggleLike(currentNote)"
            >
              {{ isLiked(currentNote.id) ? '👍 已赞' : '👍 点赞' }} {{ currentNote.likes }}
            </el-button>
            <el-button
              :type="isFavorited(currentNote.id) ? 'warning' : 'default'"
              round
              @click="toggleFavorite(currentNote)"
            >
              {{ isFavorited(currentNote.id) ? '⭐ 已收藏' : '⭐ 收藏' }}
            </el-button>
          </div>

          <!-- 评论区 -->
          <div class="comments-section">
            <h4>💬 评论 ({{ currentNote.comments?.length || 0 }})</h4>
            <div class="comments-list">
              <div v-for="comment in currentNote.comments" :key="comment.id" class="comment-item">
                <span class="comment-avatar">{{ (comment.author || '?').charAt(0) }}</span>
                <div class="comment-body">
                  <span class="comment-author">{{ comment.author }}</span>
                  <p class="comment-text">{{ comment.content }}</p>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
              </div>
              <div v-if="!currentNote.comments?.length" class="no-comments">
                暂无评论，快来抢沙发吧~
              </div>
            </div>
            <div class="comment-input">
              <el-input
                v-model="newComment"
                placeholder="写下你的评论..."
                @keyup.enter="submitComment"
              />
              <el-button type="primary" @click="submitComment">发送</el-button>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 发布笔记弹窗 -->
      <el-dialog
        v-model="showPublishModal"
        title="发布笔记"
        width="600px"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        :show-close="true"
      >
        <el-form :model="publishForm" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="publishForm.title" placeholder="给你的笔记起个标题" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="publishForm.category" placeholder="选择分类">
              <el-option v-for="cat in categories.slice(1)" :key="cat" :label="cat" :value="cat" />
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              v-model="publishForm.content"
              type="textarea"
              :rows="6"
              placeholder="分享你的求职经验、心得体会..."
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="配图">
            <el-input v-model="publishForm.cover" placeholder="图片URL（可选）" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showPublishModal = false">取消</el-button>
          <el-button type="primary" @click="publishNote">发布</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const userStore = useUserStore()

// mine模式: 只显示当前用户的笔记
const mineMode = computed(() => route.query.mine === 'true')

const categories = ['全部', '面试经验', '简历技巧', '职场心得', '学习资源', '其他']
const selectedCategory = ref('全部')
const showDetailModal = ref(false)
const showPublishModal = ref(false)
const currentNote = ref(null)
const newComment = ref('')
const likedNotes = ref([])
const favoritedNotes = ref([])

const publishForm = ref({
  title: '',
  category: '',
  content: '',
  cover: ''
})

// 模拟笔记数据
const mockNotes = [
  {
    id: 3,
    title: '双非本科如何拿下大厂SSP offer',
    author: '逆袭的学长',
    category: '面试经验',
    content: '背景：普通二本，计算机专业，无大厂实习，最终拿到字节跳动SSP（ special offer）。\n\n很多人问我双非是不是没机会进大厂，我的答案是：学历只是敲门砖，技术才是硬通货。\n\n【我的准备路线】\n\n📚 基础（2个月）\n- 数据结构与算法：LeetCode刷了300题，按专题分类刷\n- 操作系统、计算机网络：看《图解HTTP》《小林coding》\n- 数据库：MySQL索引优化、Redis常见场景\n\n🛠 项目（1.5个月）\n做了一个开源项目：分布式链路追踪系统\n- 完整的前后端 + 部署文档\n- GitHub 500+ star\n- 面试中项目是最大的加分项\n\n💡 面试技巧\n1. 自我介绍控制在1分钟内，突出技术栈和项目亮点\n2. 不会的问题不要瞎编，说"这个我了解不深，我的理解是…"反而加分\n3. 每轮面试最后反问环节一定要准备问题\n\n双非不是终点，是起点。加油！',
    cover: 'https://picsum.photos/400/300?random=3',
    date: '2026-05-15',
    likes: 890,
    comments: [
      { id: 1, author: '同是双非', content: '学长太励志了！请问开源项目怎么起步？', time: '2026-05-15 22:10' },
      { id: 2, author: '逆袭的学长', content: '先从给别人的项目提PR开始，慢慢就知道怎么做了', time: '2026-05-16 08:30' }
    ]
  },
  {
    id: 4,
    title: '产品经理求职｜从零准备到面经汇总',
    author: 'PM小鹿',
    category: '面试经验',
    content: '非科班转产品，拿到了美团和滴滴的offer，整理一下我的面试经验。\n\n【产品经理核心能力】\n1. 逻辑思维：能用流程图、思维导图清晰表达\n2. 用户洞察：会做用户调研、数据分析\n3. 文档能力：PRD、竞品分析报告\n4. 沟通协作：跨部门推动项目\n\n【面试必考题】\n📌 "分析一款你最喜欢的APP"\n→ 推荐用"用户-场景-需求-方案"框架\n📌 "如果XX功能数据下降怎么分析"\n→ 用漏斗分析法拆解每一步\n📌 "你是怎么做需求排期的"\n→ 用Kano模型或RICE评分\n\n【推荐学习资源】\n- 书籍：《人人都是产品经理》《俞军产品方法论》\n- 网站：人人都是产品经理社区、36Kr\n- 工具：Axure、Figma、XMind、ProcessOn\n\nPM面试更看重思维方式和产品感，多体验、多思考、多总结！',
    cover: 'https://picsum.photos/400/300?random=4',
    date: '2026-05-12',
    likes: 345,
    comments: []
  },
  {
    id: 5,
    title: '被裁后三个月，我如何薪资翻倍上岸',
    author: '职场老鸟',
    category: '职场心得',
    content: '去年年底被裁，从焦虑到重新出发，三个月后拿到比原来高50%的offer。\n\n【被裁第一天】\n慌了，刷了三个小时招聘软件，发现合适的岗位很少。\n\n【第一周】\n冷静下来做了三件事：\n1. 更新简历，复盘过去的项目成果\n2. 梳理目标岗位的能力要求，找出差距\n3. 制定学习计划，每天4小时学习+2小时投递\n\n【第一个月】\n- 系统学习了系统设计和架构知识\n- 做了两个Demo项目充实简历\n- 投递了50+公司，面试邀约率30%\n\n【第二个月】\n- 疯狂面试，每次面试都录音复盘\n- 把高频问题整理成逐字稿\n- 从最开始面一家挂一家，到后面基本都能到终面\n\n【第三个月】\n- 收到4个offer，其中2个薪资翻倍\n- 选了一家业务方向最喜欢的\n\n💡 被裁不可怕，可怕的是没有行动的焦虑。保持节奏，提升自己，机会总会来的！',
    cover: 'https://picsum.photos/400/300?random=5',
    date: '2026-05-08',
    likes: 678,
    comments: [
      { id: 3, author: '刚被裁', content: '看到这个我又有信心了，谢谢分享！', time: '2026-05-09 10:15' },
      { id: 4, author: '职场老鸟', content: '加油！你一定可以的💪', time: '2026-05-09 11:00' }
    ]
  },
  {
    id: 6,
    title: '数据分析师必备技能清单｜附学习路线',
    author: '数据小阿姨',
    category: '学习资源',
    content: '整理了一份数据分析师从入门到入行最全技能清单。\n\n【工具篇】\n1. Excel：数据透视表、VLOOKUP、函数（基础）\n2. SQL：窗口函数、多表连接、子查询（核心）\n3. Python：Pandas、NumPy、Matplotlib（加分）\n4. BI工具：Tableau、PowerBI、FineBI（必备）\n\n【理论篇】\n- 统计学：假设检验、回归分析、AB测试\n- 分析方法：漏斗分析、RFM模型、用户留存分析\n- 机器学习基础：聚类、分类、推荐算法\n\n【学习路线】\nPhase 1（1-2个月）：Excel + SQL → 能做基础取数\nPhase 2（2-3个月）：Python + BI工具 → 能做可视化分析\nPhase 3（持续）：统计学 + 分析方法 → 能独立完成分析报告\n\n【推荐资源】\n- 课程：Coursera - Google Data Analytics\n- 书籍：《利用Python进行数据分析》《精益数据分析》\n- 练习：Kaggle、天池、牛客网SQL题库\n\n数据岗最大的门槛不是工具，而是业务思维。多问"为什么"，少问"怎么做"！',
    cover: 'https://picsum.photos/400/300?random=6',
    date: '2026-05-05',
    likes: 423,
    comments: []
  },
  {
    id: 7,
    title: '应届生第一份工作：大厂还是创业公司？',
    author: '职业规划师',
    category: '职场心得',
    content: '每年校招季都有很多同学问我：第一份工作该去大厂还是创业公司？\n\n【大厂的优势】\n✅ 完善的培养体系：新人培训、导师制\n✅ 平台背书：跳槽时大厂经历是硬通货\n✅ 接触规范流程：了解成熟团队的协作方式\n✅ 人脉积累：同事都是行业优秀人才\n❌ 可能螺丝钉：工作内容可能很细分\n\n【创业公司的优势】\n✅ 成长速度快：一个人当三个人用\n✅ 接触面广：前端后端运维都要干\n✅ 晋升空间大：做得好很快能带团队\n✅ 期权可能：公司上市可能财务自由\n❌ 稳定性差：可能随时倒闭\n\n【我的建议】\n1. 第一份工作优先选大厂，打好基础\n2. 如果去创业公司，选B轮以上、现金流健康的\n3. 无论去哪里，前三年积累的技术>薪资\n4. 换工作不要只看薪资涨幅，看成长空间\n\n你选大厂还是创业公司？评论区聊聊～',
    cover: 'https://picsum.photos/400/300?random=7',
    date: '2026-05-01',
    likes: 567,
    comments: [
      { id: 5, author: '纠结中', content: '现在就在大厂offer和创业公司offer之间纠结…', time: '2026-05-01 20:30' },
      { id: 6, author: '职业规划师', content: '看你现阶段最想要什么，没有标准答案，选择适合自己的', time: '2026-05-01 21:00' }
    ]
  },
  {
    id: 8,
    title: '面试被问"你的缺点是什么"这样答',
    author: 'offer收割机',
    category: '职场心得',
    content: '最经典的面试难题，80%的人都答不好。\n\n❌ 错误回答：\n- "我最大的缺点就是太追求完美"——太假了\n- "我没有什么缺点"——缺乏自我认知\n- "我脾气不好/我粗心"——太实诚了\n\n✅ 正确示范：\n"我之前在公众演讲方面比较薄弱，负责项目汇报时经常紧张。后来我主动报名参加了公司内部的演讲俱乐部，每次汇报前至少练习三遍并录视频复盘，现在虽然还是会有紧张，但已经能清晰有条理地表达我的观点了。"\n\n【回答公式】\n真实缺点 + 改进行动 + 取得效果\n\n【常见可说的缺点方向】\n1. 管理能力还需提升（适合技术转管理）\n2. 对细节过于关注影响效率（体现你有全局意识）\n3. 不太擅长拒绝别人导致任务堆积（体现你有协作精神）\n\n核心是展示你认识到了问题，并且正在积极改进。面试官想看的不是完美的人，而是有成长潜力的人！',
    cover: 'https://picsum.photos/400/300?random=8',
    date: '2026-04-28',
    likes: 734,
    comments: []
  }
]

const notes = ref([])

// 过滤笔记
const filteredNotes = computed(() => {
  let result = notes.value

  // mine模式：只显示当前用户的笔记
  if (mineMode.value && userStore.isLoggedIn) {
    result = result.filter(n => n.author === userStore.user?.username)
  }

  if (selectedCategory.value === '全部') {
    return result
  }
  return result.filter(n => n.category === selectedCategory.value)
})

// 打开笔记详情
const openNoteDetail = (note) => {
  // 创建副本，避免直接修改原数据
  currentNote.value = JSON.parse(JSON.stringify(note))
  showDetailModal.value = true
}

// 处理详情弹窗关闭
const handleDetailClose = () => {
  // Sync any local changes (likes, comments) back to notes array
  if (currentNote.value) {
    const originalNote = notes.value.find(n => n.id === currentNote.value.id)
    if (originalNote) {
      originalNote.likes = currentNote.value.likes
      originalNote.comments = JSON.parse(JSON.stringify(currentNote.value.comments || []))
    }
    // Save community notes to persist comments and likes
    userStore.saveCommunityNotes(notes.value)
  }
  currentNote.value = null
}

// 是否已点赞
const isLiked = (noteId) => {
  return likedNotes.value.includes(noteId)
}

// 是否已收藏
const isFavorited = (noteId) => {
  return favoritedNotes.value.includes(noteId)
}

// 点赞
const toggleLike = (note) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  const index = likedNotes.value.indexOf(note.id)
  if (index > -1) {
    likedNotes.value.splice(index, 1)
    note.likes--
  } else {
    likedNotes.value.push(note.id)
    note.likes++
    ElMessage.success('点赞成功')
  }

  userStore.saveLikedNotes(likedNotes.value)
}

// 收藏
const toggleFavorite = (note) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  const index = favoritedNotes.value.indexOf(note.id)
  if (index > -1) {
    favoritedNotes.value.splice(index, 1)
    ElMessage.info('已取消收藏')
  } else {
    favoritedNotes.value.push(note.id)
    ElMessage.success('收藏成功')
  }

  userStore.saveFavorites(favoritedNotes.value)
}

// 提交评论
const submitComment = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  const comment = {
    id: Date.now(),
    author: userStore.user.username,
    content: newComment.value.trim(),
    time: new Date().toLocaleString()
  }

  if (!currentNote.value.comments) {
    currentNote.value.comments = []
  }
  currentNote.value.comments.push(comment)

  // Sync to the original notes array
  const originalNote = notes.value.find(n => n.id === currentNote.value.id)
  if (originalNote) {
    if (!originalNote.comments) originalNote.comments = []
    originalNote.comments.push({ ...comment })
  }

  // Save community notes persistently
  userStore.saveCommunityNotes(notes.value)

  // Clear the comment input
  newComment.value = ''
  ElMessage.success('评论成功')
}

// 发布笔记
const publishNote = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  if (!publishForm.value.title || !publishForm.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  const note = {
    id: Date.now(),
    title: publishForm.value.title,
    author: userStore.user.username,
    category: publishForm.value.category || '其他',
    content: publishForm.value.content,
    cover: publishForm.value.cover || `https://picsum.photos/400/300?random=${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    likes: 0,
    comments: []
  }

  // Add to local notes list (at the top)
  notes.value.unshift(note)

  // Save to userStore for persistence
  userStore.saveCommunityNotes(notes.value)

  // Also save to user's own notes
  const myNotes = userStore.loadMyNotes()
  myNotes.unshift(note)
  userStore.saveMyNotes(myNotes)

  // Reset the publish form
  publishForm.value = { title: '', category: '', content: '', cover: '' }

  // Close the publish dialog
  showPublishModal.value = false

  ElMessage.success('发布成功')
}

// Load community notes from localStorage on mount, merge with mock data
onMounted(() => {
  // Load liked notes from userStore
  likedNotes.value = userStore.loadLikedNotes()

  // Load favorited notes from userStore
  favoritedNotes.value = userStore.loadFavorites()

  // Load saved community notes
  const savedCommunityNotes = userStore.loadCommunityNotes()

  // 清理杂乱的测试笔记（按标题匹配）
  const messyTitles = ['33', '2', '1', '对方过后', '对方之后', '3', '对方']
  const cleanedNotes = savedCommunityNotes.filter(n => {
    if (!n.title) return true
    const t = n.title.trim()
    // 排除纯数字标题或包含"对方"的杂乱标题，且不是正常笔记
    if (messyTitles.includes(t)) return false
    // 也排除内容太短的杂乱笔记（少于5个字）
    if (t.length <= 2 && (!n.content || n.content.length < 10)) return false
    return true
  })
  // 如果清理后有变化，保存回去
  if (cleanedNotes.length !== savedCommunityNotes.length) {
    userStore.saveCommunityNotes(cleanedNotes)
  }

  // Merge: start with mock data, then add any user-created notes that aren't already in the list
  const mockIds = new Set(mockNotes.map(n => n.id))
  const userCreatedNotes = cleanedNotes.filter(n => !mockIds.has(n.id))

  // For mock notes, prefer the saved version (it may have updated comments/likes)
  const savedById = {}
  for (const n of savedCommunityNotes) {
    savedById[n.id] = n
  }

  notes.value = mockNotes.map(mock => {
    const saved = savedById[mock.id]
    if (saved) {
      // Use saved version which has updated comments/likes
      return saved
    }
    return mock
  })

  // Append user-created notes at the top
  notes.value = [...userCreatedNotes, ...notes.value]
})
</script>

<style scoped>
.community-page {
  padding-top: 80px;
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.publish-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.category-tabs {
  display: flex;
  gap: 8px;
}

.cat-tab {
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.cat-tab:hover {
  background: rgba(37, 99, 235, 0.1);
}

.cat-tab.active {
  background: #2563eb;
  color: #fff;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.note-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.note-cover {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.note-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.note-category-tag {
  background: rgba(37, 99, 235, 0.85);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.note-content {
  padding: 16px;
}

.note-tag-row {
  margin-bottom: 8px;
}

.note-category-badge {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%) !important;
  border-color: #2563eb !important;
  font-size: 12px;
}

.note-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.note-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.6;
  margin-bottom: 12px;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.author-avatar.large {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.note-stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #999;
}

/* 详情弹窗 */
.note-detail {
  padding: 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #333;
}

.publish-time {
  font-size: 12px;
  color: #999;
}

.detail-cover {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
}

.detail-text {
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}

.detail-actions {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 评论区 */
.comments-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.comments-section h4 {
  margin-bottom: 16px;
  color: #333;
}

.comments-list {
  margin-bottom: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
}

.comment-author {
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}

.comment-text {
  color: #666;
  margin: 4px 0;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 20px;
}

.comment-input {
  display: flex;
  gap: 12px;
}

.comment-input .el-input {
  flex: 1;
}
</style>

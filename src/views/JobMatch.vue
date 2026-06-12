<template>
  <div class="job-match-page">
    <div class="container">
      <div class="page-header">
        <h1>岗位智能匹配</h1>
        <p>基于您的简历画像，AI为您精准匹配适配岗位</p>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-item">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索岗位名称或公司"
            clearable
          />
        </div>
        <div class="filter-item">
          <el-select v-model="filterCity" placeholder="选择城市/省份" filterable clearable>
            <el-option label="全部" value="" />
            <el-option-group label="直辖市">
              <el-option label="北京" value="北京" />
              <el-option label="上海" value="上海" />
              <el-option label="天津" value="天津" />
              <el-option label="重庆" value="重庆" />
            </el-option-group>
            <el-option-group label="省/自治区">
              <el-option label="河北省" value="河北省" />
              <el-option label="山西省" value="山西省" />
              <el-option label="辽宁省" value="辽宁省" />
              <el-option label="吉林省" value="吉林省" />
              <el-option label="黑龙江省" value="黑龙江省" />
              <el-option label="江苏省" value="江苏省" />
              <el-option label="浙江省" value="浙江省" />
              <el-option label="安徽省" value="安徽省" />
              <el-option label="福建省" value="福建省" />
              <el-option label="江西省" value="江西省" />
              <el-option label="山东省" value="山东省" />
              <el-option label="河南省" value="河南省" />
              <el-option label="湖北省" value="湖北省" />
              <el-option label="湖南省" value="湖南省" />
              <el-option label="广东省" value="广东省" />
              <el-option label="海南省" value="海南省" />
              <el-option label="四川省" value="四川省" />
              <el-option label="贵州省" value="贵州省" />
              <el-option label="云南省" value="云南省" />
              <el-option label="陕西省" value="陕西省" />
              <el-option label="甘肃省" value="甘肃省" />
              <el-option label="青海省" value="青海省" />
              <el-option label="内蒙古自治区" value="内蒙古" />
              <el-option label="广西壮族自治区" value="广西" />
              <el-option label="西藏自治区" value="西藏" />
              <el-option label="宁夏回族自治区" value="宁夏" />
              <el-option label="新疆维吾尔自治区" value="新疆" />
              <el-option label="香港特别行政区" value="香港" />
              <el-option label="澳门特别行政区" value="澳门" />
              <el-option label="台湾省" value="台湾" />
            </el-option-group>
            <el-option-group label="热门城市">
              <el-option label="深圳" value="深圳" />
              <el-option label="广州" value="广州" />
              <el-option label="杭州" value="杭州" />
              <el-option label="南京" value="南京" />
              <el-option label="成都" value="成都" />
              <el-option label="武汉" value="武汉" />
              <el-option label="西安" value="西安" />
              <el-option label="苏州" value="苏州" />
              <el-option label="东莞" value="东莞" />
              <el-option label="佛山" value="佛山" />
              <el-option label="宁波" value="宁波" />
              <el-option label="无锡" value="无锡" />
              <el-option label="长沙" value="长沙" />
              <el-option label="郑州" value="郑州" />
              <el-option label="济南" value="济南" />
              <el-option label="青岛" value="青岛" />
              <el-option label="合肥" value="合肥" />
              <el-option label="福州" value="福州" />
              <el-option label="厦门" value="厦门" />
              <el-option label="南昌" value="南昌" />
              <el-option label="贵阳" value="贵阳" />
              <el-option label="昆明" value="昆明" />
              <el-option label="兰州" value="兰州" />
              <el-option label="石家庄" value="石家庄" />
              <el-option label="沈阳" value="沈阳" />
              <el-option label="大连" value="大连" />
              <el-option label="哈尔滨" value="哈尔滨" />
              <el-option label="长春" value="长春" />
              <el-option label="太原" value="太原" />
              <el-option label="南宁" value="南宁" />
              <el-option label="乌鲁木齐" value="乌鲁木齐" />
              <el-option label="珠海" value="珠海" />
              <el-option label="惠州" value="惠州" />
              <el-option label="中山" value="中山" />
            </el-option-group>
          </el-select>
        </div>
        <div class="filter-item">
          <el-select v-model="filterType" placeholder="企业类型" filterable clearable>
            <el-option label="全部" value="" />
            <el-option label="互联网" value="互联网" />
            <el-option label="通信/硬件" value="通信" />
            <el-option label="消费电子" value="消费电子" />
            <el-option label="金融科技" value="金融科技" />
            <el-option label="银行/证券" value="银行/证券" />
            <el-option label="电子商务" value="电子商务" />
            <el-option label="人工智能" value="人工智能" />
            <el-option label="教育培训" value="教育培训" />
            <el-option label="医疗健康" value="医疗健康" />
            <el-option label="企业服务/SaaS" value="企业服务" />
            <el-option label="游戏娱乐" value="游戏" />
            <el-option label="媒体/内容" value="媒体/内容" />
            <el-option label="房地产/建筑" value="房地产" />
            <el-option label="汽车/出行" value="汽车/出行" />
            <el-option label="物流/供应链" value="物流/供应链" />
            <el-option label="新能源/环保" value="新能源" />
            <el-option label="传统制造" value="传统制造" />
            <el-option label="咨询/专业服务" value="咨询/专业服务" />
            <el-option label="外资企业" value="外资企业" />
            <el-option label="国企/央企" value="国企/央企" />
            <el-option label="事业单位" value="事业单位" />
            <el-option label="初创公司" value="初创公司" />
          </el-select>
        </div>
        <div class="filter-item">
          <el-select v-model="filterJobType" placeholder="岗位类型" filterable clearable>
            <el-option label="全部" value="" />
            <el-option label="校招" value="校招" />
            <el-option label="实习" value="实习" />
            <el-option label="社招" value="社招" />
            <el-option label="兼职" value="兼职" />
            <el-option label="远程办公" value="远程办公" />
            <el-option label="管培生" value="管培生" />
            <el-option label="日常实习" value="日常实习" />
            <el-option label="暑期实习" value="暑期实习" />
          </el-select>
        </div>
        <div class="filter-item">
          <el-select v-model="filterPosition" placeholder="职位方向" filterable clearable>
            <el-option label="全部" value="" />
            <el-option label="前端开发" value="前端开发" />
            <el-option label="后端开发" value="后端开发" />
            <el-option label="全栈开发" value="全栈开发" />
            <el-option label="移动端开发" value="移动端开发" />
            <el-option label="算法/AI" value="算法" />
            <el-option label="数据开发" value="数据开发" />
            <el-option label="数据分析" value="数据分析" />
            <el-option label="测试/质量" value="测试" />
            <el-option label="运维/DevOps" value="运维" />
            <el-option label="安全" value="安全" />
            <el-option label="产品经理" value="产品经理" />
            <el-option label="UI/UX设计" value="设计" />
            <el-option label="项目管理" value="项目管理" />
            <el-option label="运营/增长" value="运营" />
            <el-option label="市场营销" value="市场营销" />
            <el-option label="人力资源" value="人力资源" />
            <el-option label="财务/审计" value="财务" />
            <el-option label="法务/合规" value="法务" />
          </el-select>
        </div>
        <el-button type="primary" @click="applyFilters">筛选</el-button>
      </div>

      <!-- 匹配结果统计 -->
      <div class="stats-bar">
        <div class="stat-item clickable" @click="scrollTo('high')">
          <span class="stat-value">{{ filteredResults.length }}</span>
          <span class="stat-label">匹配岗位</span>
        </div>
        <div class="stat-item clickable" @click="scrollTo('high')">
          <span class="stat-value high">{{ highMatch }}</span>
          <span class="stat-label">高分优选岗</span>
        </div>
        <div class="stat-item clickable" @click="scrollTo('medium')">
          <span class="stat-value medium">{{ mediumMatch }}</span>
          <span class="stat-label">潜力适配岗</span>
        </div>
        <div class="stat-item clickable" @click="scrollTo('low')">
          <span class="stat-value low">{{ lowMatch }}</span>
          <span class="stat-label">备选岗位</span>
        </div>
      </div>

      <!-- 匹配结果列表 -->
      <div class="match-results">
        <!-- 高分优选岗 -->
        <div v-if="highMatchList.length > 0" class="result-section" id="section-high">
          <div class="section-header">
            <span class="section-icon">🏆</span>
            <h3>高分优选岗 (≥80%)</h3>
          </div>
          <div class="jobs-list">
            <div v-for="item in highMatchList" :key="item.job.id" class="job-card high">
              <div class="job-header">
                <div class="job-info">
                  <h4>{{ item.job.name }}</h4>
                  <p>{{ item.job.company }} · {{ item.job.location }}</p>
                </div>
                <div class="match-score high">{{ item.score }}%</div>
              </div>
              <div class="job-salary">{{ item.job.salary }}</div>
              <div class="match-details">
                <div class="highlights">
                  <span class="detail-label">匹配亮点：</span>
                  <el-tag v-for="(h, i) in item.highlights" :key="i" class="highlight-tag">{{ h }}</el-tag>
                </div>
                <div class="weaknesses">
                  <span class="detail-label">能力短板：</span>
                  <el-tag v-for="(w, i) in item.weaknesses" :key="i" class="weakness-tag">{{ w }}</el-tag>
                </div>
              </div>
              <div class="job-actions">
                <el-button type="primary" @click="goToDiagnose(item.job)">诊断优化</el-button>
                <el-button :type="isFavorite(item.job.id) ? 'warning' : 'default'" @click="toggleFavorite(item.job)">
                  {{ isFavorite(item.job.id) ? '⭐ 已收藏' : '☆ 收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 潜力适配岗 -->
        <div v-if="mediumMatchList.length > 0" class="result-section" id="section-medium">
          <div class="section-header">
            <span class="section-icon">⭐</span>
            <h3>潜力适配岗 (50%-79%)</h3>
          </div>
          <div class="jobs-list">
            <div v-for="item in mediumMatchList" :key="item.job.id" class="job-card medium">
              <div class="job-header">
                <div class="job-info">
                  <h4>{{ item.job.name }}</h4>
                  <p>{{ item.job.company }} · {{ item.job.location }}</p>
                </div>
                <div class="match-score medium">{{ item.score }}%</div>
              </div>
              <div class="job-salary">{{ item.job.salary }}</div>
              <div class="match-details">
                <div class="highlights">
                  <span class="detail-label">匹配亮点：</span>
                  <el-tag v-for="(h, i) in item.highlights" :key="i" class="highlight-tag">{{ h }}</el-tag>
                </div>
                <div class="weaknesses">
                  <span class="detail-label">能力短板：</span>
                  <el-tag v-for="(w, i) in item.weaknesses" :key="i" class="weakness-tag">{{ w }}</el-tag>
                </div>
              </div>
              <div class="job-actions">
                <el-button type="primary" @click="goToDiagnose(item.job)">诊断优化</el-button>
                <el-button :type="isFavorite(item.job.id) ? 'warning' : 'default'" @click="toggleFavorite(item.job)">
                  {{ isFavorite(item.job.id) ? '⭐ 已收藏' : '☆ 收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 备选岗位 -->
        <div v-if="lowMatchList.length > 0" class="result-section">
          <div class="section-header">
            <span class="section-icon">💡</span>
            <h3>备选岗位 (<50%)</h3>
          </div>
          <div class="jobs-list">
            <div v-for="item in lowMatchList" :key="item.job.id" class="job-card low">
              <div class="job-header">
                <div class="job-info">
                  <h4>{{ item.job.name }}</h4>
                  <p>{{ item.job.company }} · {{ item.job.location }}</p>
                </div>
                <div class="match-score low">{{ item.score }}%</div>
              </div>
              <div class="job-salary">{{ item.job.salary }}</div>
              <div class="match-details">
                <div class="highlights">
                  <span class="detail-label">匹配亮点：</span>
                  <el-tag v-for="(h, i) in item.highlights" :key="i" class="highlight-tag">{{ h }}</el-tag>
                </div>
                <div class="weaknesses">
                  <span class="detail-label">能力短板：</span>
                  <el-tag v-for="(w, i) in item.weaknesses" :key="i" class="weakness-tag">{{ w }}</el-tag>
                </div>
              </div>
              <div class="job-actions">
                <el-button type="primary" @click="goToDiagnose(item.job)">诊断优化</el-button>
                <el-button :type="isFavorite(item.job.id) ? 'warning' : 'default'" @click="toggleFavorite(item.job)">
                  {{ isFavorite(item.job.id) ? '⭐ 已收藏' : '☆ 收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div v-if="filteredResults.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>暂无匹配岗位</p>
          <p class="empty-tip">尝试调整筛选条件或完善简历信息</p>
        </div>
      </div>

      <!-- 回到顶部 -->
      <div class="back-to-top" v-if="showBackTop" @click="scrollToTop">
        ⬆
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockJobs } from '@/utils/mockData'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const filterCity = ref('')
const filterType = ref('')
const filterJobType = ref('')
const filterPosition = ref('')
const favorites = ref([])

// 加载收藏
onMounted(() => {
  favorites.value = userStore.loadFavorites()
  // 生成匹配结果
  matchResults.value = generateMatchResults()
})

const generateMatchResults = () => {
  return mockJobs.map(job => ({
    job,
    score: Math.floor(Math.random() * 60) + 40,
    highlights: ['相关专业匹配', '实习经历相关', '技能符合要求'],
    weaknesses: ['项目经验不足', '缺少相关证书']
  }))
}

const matchResults = ref([])

const filteredResults = computed(() => {
  return matchResults.value.filter(item => {
    const job = item.job
    const matchKeyword = !searchKeyword.value ||
      job.name.includes(searchKeyword.value) ||
      job.company.includes(searchKeyword.value)
    const matchCity = !filterCity.value || job.location === filterCity.value
    const matchType = !filterType.value || job.companyType === filterType.value
    const matchJobType = !filterJobType.value || job.type === filterJobType.value
    const matchPosition = !filterPosition.value || job.name.includes(filterPosition.value)
    return matchKeyword && matchCity && matchType && matchJobType && matchPosition
  })
})

const highMatch = computed(() => filteredResults.value.filter(r => r.score >= 80).length)
const mediumMatch = computed(() => filteredResults.value.filter(r => r.score >= 50 && r.score < 80).length)
const lowMatch = computed(() => filteredResults.value.filter(r => r.score < 50).length)

const highMatchList = computed(() => filteredResults.value.filter(r => r.score >= 80))
const mediumMatchList = computed(() => filteredResults.value.filter(r => r.score >= 50 && r.score < 80))
const lowMatchList = computed(() => filteredResults.value.filter(r => r.score < 50))

const applyFilters = () => {
  matchResults.value = generateMatchResults()
}

const isFavorite = (jobId) => {
  return favorites.value.some(f => f.id === jobId)
}

const toggleFavorite = (job) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }

  const idx = favorites.value.findIndex(f => f.id === job.id)
  if (idx > -1) {
    favorites.value.splice(idx, 1)
    ElMessage.success('已取消收藏')
  } else {
    favorites.value.push({
      id: job.id,
      name: job.name,
      company: job.company,
      location: job.location,
      salary: job.salary
    })
    ElMessage.success('收藏成功')
  }
  userStore.saveFavorites(favorites.value)
}

const goToDiagnose = (job) => {
  localStorage.setItem('selectedJob', JSON.stringify(job))
  router.push('/resume-check')
}

// 滚动到指定区域
const scrollTo = (section) => {
  const el = document.getElementById(`section-${section}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 回到顶部
const showBackTop = ref(false)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
const handleScroll = () => { showBackTop.value = window.scrollY > 500 }
onMounted(() => { window.addEventListener('scroll', handleScroll) })

onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })
</script>

<style scoped>
.job-match-page {
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

.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 150px;
  max-width: 200px;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-item {
  text-align: center;
}
.stat-item.clickable {
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 16px;
  transition: background 0.2s;
}
.stat-item.clickable:hover {
  background: #eff6ff;
}

/* 回到顶部 */
.back-to-top {
  position: fixed;
  bottom: 160px;
  right: 30px;
  width: 44px;
  height: 44px;
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  z-index: 997;
  transition: all 0.3s;
}
.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
}

.stat-value.high {
  color: #22c55e;
}

.stat-value.medium {
  color: #f59e0b;
}

.stat-value.low {
  color: #9ca3af;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

.match-results {
  margin-top: 20px;
}

.result-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-icon {
  font-size: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.jobs-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.job-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-left: 4px solid;
}

.job-card.high {
  border-left-color: #22c55e;
}

.job-card.medium {
  border-left-color: #f59e0b;
}

.job-card.low {
  border-left-color: #9ca3af;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.job-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.job-info p {
  font-size: 13px;
  color: #666;
}

.match-score {
  font-size: 24px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
}

.match-score.high {
  background: #dcfce7;
  color: #22c55e;
}

.match-score.medium {
  background: #fef3c7;
  color: #f59e0b;
}

.match-score.low {
  background: #f3f4f6;
  color: #9ca3af;
}

.job-salary {
  font-size: 18px;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 16px;
}

.match-details {
  margin-bottom: 16px;
}

.detail-label {
  font-size: 13px;
  color: #999;
  margin-right: 8px;
}

.highlight-tag {
  background: #dcfce7;
  color: #166534;
}

.weakness-tag {
  background: #fee2e2;
  color: #991b1b;
}

.job-actions {
  display: flex;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #666;
}

.empty-tip {
  font-size: 13px !important;
  color: #999 !important;
}
</style>

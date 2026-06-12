<template>
  <div class="home-page">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <h1>🎯 Offer捕手</h1>
        <p class="subtitle">AI驱动的求职成长平台，帮你精准匹配理想工作</p>
        <div class="banner-actions">
          <el-button type="primary" size="large" round @click="$router.push('/job-match')">
            开始匹配
          </el-button>
          <el-button size="large" round @click="$router.push('/ai-consult')">
            AI咨询
          </el-button>
        </div>
      </div>
      <div class="banner-illustration">
        <div class="floating-card card1">💼</div>
        <div class="floating-card card2">🎯</div>
        <div class="floating-card card3">✨</div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-entry">
      <div class="container">
        <h2>🚀 快捷入口</h2>
        <div class="entry-grid">
          <div class="entry-item" @click="$router.push('/resume')">
            <div class="entry-icon">📄</div>
            <h3>简历创建</h3>
            <p>上传解析 · 在线制作 · 云端管理</p>
          </div>
          <div class="entry-item" @click="$router.push('/job-match')">
            <div class="entry-icon">🎯</div>
            <h3>岗位匹配</h3>
            <p>AI智能匹配 · 精准推荐</p>
          </div>
          <div class="entry-item" @click="$router.push('/resume-check')">
            <div class="entry-icon">🔍</div>
            <h3>简历诊断</h3>
            <p>JD对比 · 优化建议</p>
          </div>
          <div class="entry-item" @click="$router.push('/ai-consult')">
            <div class="entry-icon">🤖</div>
            <h3>AI咨询</h3>
            <p>职业规划 · 答疑解惑</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心功能 -->
    <div class="features">
      <div class="container">
        <h2>✨ 核心功能</h2>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-content">
              <h3>📝 求职心路日志</h3>
              <p>记录求职过程中的心情、感悟和成长。支持标签管理、时间线沉淀，让每一步成长都有迹可循。</p>
            </div>
            <div class="feature-preview">
              <div class="mock-card">
                <div class="mock-header">今天收到面试邀请了！</div>
                <div class="mock-tags">
                  <span class="mock-tag">面试</span>
                  <span class="mock-tag">开心</span>
                </div>
              </div>
            </div>
          </div>

          <div class="feature-item reverse">
            <div class="feature-content">
              <h3>👥 求职笔记社区</h3>
              <p>分享求职经验，获取同行建议。面试复盘、简历技巧、职场心得，与求职伙伴互助成长。</p>
            </div>
            <div class="feature-preview">
              <div class="mock-grid">
                <div class="mock-note">面试经验</div>
                <div class="mock-note">简历技巧</div>
                <div class="mock-note">职场心得</div>
              </div>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-content">
              <h3>📚 求职干货</h3>
              <p>精选求职攻略、行业分析、学习资源。从简历到面试，从入门到进阶，一站式学习成长。</p>
            </div>
            <div class="feature-preview">
              <div class="mock-list">
                <div class="mock-item">2026前端面试高频考点</div>
                <div class="mock-item">简历这样写HR秒回</div>
                <div class="mock-item">互联网薪资报告</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门岗位 -->
    <div class="hot-jobs">
      <div class="container">
        <h2>🔥 热门岗位</h2>
        <div class="jobs-grid">
          <div v-for="job in hotJobs" :key="job.id" class="job-card" @click="openJobDetail(job)">
            <div class="job-header">
              <span class="job-name">{{ job.name }}</span>
              <span class="job-salary">{{ job.salary }}</span>
            </div>
            <div class="job-company">{{ job.company }}</div>
            <div class="job-tags">
              <span v-for="tag in job.tags" :key="tag" class="job-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 岗位详情弹窗 -->
    <el-dialog
      v-model="showJobModal"
      :title="currentJob?.name"
      width="680px"
      class="job-detail-dialog"
      :close-on-click-modal="false"
    >
      <div v-if="currentJob" class="job-detail">
        <!-- 头部：公司 + 薪资 -->
        <div class="detail-header">
          <div class="company-info">
            <span class="company-name">{{ currentJob.company }}</span>
            <span class="job-location">📍 {{ currentJob.location }}</span>
          </div>
          <span class="job-salary-large">{{ currentJob.salary }}</span>
        </div>

        <!-- 薪资构成 -->
        <div class="detail-section salary-breakdown">
          <h3>💰 薪资构成</h3>
          <div class="salary-grid">
            <div class="salary-item">
              <span class="salary-label">基本薪资</span>
              <span class="salary-value">{{ currentJob.salaryBreakdown?.base || '面议' }}</span>
            </div>
            <div class="salary-item">
              <span class="salary-label">年终奖金</span>
              <span class="salary-value">{{ currentJob.salaryBreakdown?.bonus || '面议' }}</span>
            </div>
            <div class="salary-item">
              <span class="salary-label">股票/期权</span>
              <span class="salary-value">{{ currentJob.salaryBreakdown?.stock || '暂无' }}</span>
            </div>
          </div>
        </div>

        <!-- 公司介绍 -->
        <div class="detail-section company-desc">
          <h3>🏢 公司介绍</h3>
          <p class="company-intro">{{ currentJob.companyDesc }}</p>
        </div>

        <div class="detail-section">
          <h3>📋 岗位职责</h3>
          <ul class="detail-list">
            <li v-for="(item, index) in currentJob.responsibilities" :key="index">{{ item }}</li>
          </ul>
        </div>

        <div class="detail-section">
          <h3>📝 任职要求</h3>
          <ul class="detail-list">
            <li v-for="(item, index) in currentJob.requirements" :key="index">{{ item }}</li>
          </ul>
        </div>

        <!-- 职业发展路径 -->
        <div class="detail-section career-path">
          <h3>📈 职业发展路径</h3>
          <div class="career-timeline">
            <div v-for="(step, index) in currentJob.careerPath" :key="index" class="career-step">
              <div class="career-dot" :class="{ active: index === 0 }"></div>
              <div class="career-info">
                <span class="career-title">{{ step.title }}</span>
                <span class="career-year">{{ step.year }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3>🌟 岗位优势</h3>
          <ul class="detail-list">
            <li v-for="(item, index) in currentJob.benefits" :key="index">{{ item }}</li>
          </ul>
        </div>

        <!-- 相关岗位推荐 -->
        <div class="detail-section related-jobs">
          <h3>🔗 相关岗位推荐</h3>
          <div class="related-grid">
            <div
              v-for="related in getRelatedJobs(currentJob)"
              :key="related.id"
              class="related-card"
              @click.stop="openJobDetail(related)"
            >
              <div class="related-name">{{ related.name }}</div>
              <div class="related-company">{{ related.company }}</div>
              <div class="related-salary">{{ related.salary }}</div>
            </div>
          </div>
        </div>

        <div class="detail-footer">
          <el-button type="primary" @click="$router.push('/job-match')">去匹配</el-button>
          <el-button
            :type="isFavorited(currentJob) ? 'warning' : 'default'"
            @click="toggleFavorite(currentJob)"
          >
            {{ isFavorited(currentJob) ? '已收藏' : '收藏岗位' }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const showJobModal = ref(false)
const currentJob = ref(null)
const favorites = ref([])

// 加载收藏列表
onMounted(() => {
  favorites.value = userStore.loadFavorites() || []
})

// 判断是否已收藏
const isFavorited = (job) => {
  if (!job) return false
  return favorites.value.some(f => f.id === job.id)
}

// 切换收藏状态
const toggleFavorite = (job) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再收藏岗位')
    return
  }
  if (isFavorited(job)) {
    favorites.value = favorites.value.filter(f => f.id !== job.id)
    ElMessage.success('已取消收藏')
  } else {
    favorites.value.push({
      id: job.id,
      name: job.name,
      company: job.company,
      salary: job.salary,
      location: job.location,
      tags: job.tags
    })
    ElMessage.success('收藏成功！')
  }
  userStore.saveFavorites(favorites.value)
}

// 获取相关岗位推荐
const getRelatedJobs = (job) => {
  if (!job) return []
  return hotJobs.value
    .filter(j => j.id !== job.id)
    .sort((a, b) => {
      const aScore = a.tags.filter(t => job.tags.includes(t)).length
      const bScore = b.tags.filter(t => job.tags.includes(t)).length
      return bScore - aScore
    })
    .slice(0, 3)
}

// 热门岗位数据（含详情）
const hotJobs = ref([
  {
    id: 1,
    name: '前端开发工程师',
    company: '腾讯',
    salary: '25-40K',
    location: '深圳',
    tags: ['Vue', 'React', 'TypeScript'],
    salaryBreakdown: {
      base: '25-35K/月',
      bonus: '3-6个月年终奖',
      stock: 'RSU股票激励'
    },
    companyDesc: '腾讯是中国领先的互联网增值服务提供商，拥有微信、QQ等国民级产品。公司技术氛围浓厚，重视工程师文化建设，为员工提供广阔的技术成长空间和完善的职业发展体系。',
    careerPath: [
      { title: '初级前端工程师', year: '0-2年' },
      { title: '中级前端工程师', year: '2-4年' },
      { title: '高级前端工程师', year: '4-7年' },
      { title: '前端技术专家', year: '7年+' }
    ],
    responsibilities: [
      '负责Web前端产品的开发与维护',
      '参与产品需求分析和技术方案设计',
      '优化页面性能，提升用户体验',
      '与后端团队协作完成接口联调',
      '持续学习新技术，推动团队技术进步'
    ],
    requirements: [
      '本科及以上学历，计算机相关专业',
      '2年以上前端开发经验',
      '精通Vue/React等主流框架',
      '熟悉TypeScript、HTML5、CSS3',
      '有大型项目开发经验优先'
    ],
    benefits: [
      '六险一金，年度体检',
      '免费班车、食堂',
      '年终奖金，股票激励',
      '弹性工作时间',
      '丰富的团建活动'
    ]
  },
  {
    id: 2,
    name: '全栈工程师',
    company: '字节跳动',
    salary: '30-50K',
    location: '北京',
    tags: ['Node.js', 'React', 'Go'],
    salaryBreakdown: {
      base: '30-45K/月',
      bonus: '3-5个月年终奖',
      stock: '期权激励'
    },
    companyDesc: '字节跳动是全球领先的科技公司，旗下拥有抖音、今日头条、TikTok等知名产品。公司崇尚扁平化管理，追求极致效率，为技术人才提供快速成长的环境和国际化的视野。',
    careerPath: [
      { title: '全栈开发工程师', year: '0-3年' },
      { title: '高级全栈工程师', year: '3-5年' },
      { title: '技术Leader', year: '5-8年' },
      { title: '技术总监', year: '8年+' }
    ],
    responsibilities: [
      '负责产品的全栈开发工作',
      '设计和实现后端API接口',
      '开发和维护前端页面',
      '参与技术选型和架构设计',
      '优化系统性能和稳定性'
    ],
    requirements: [
      '本科及以上学历',
      '3年以上全栈开发经验',
      '精通Node.js/Python/Go中至少一种',
      '熟悉React/Vue等前端框架',
      '有高并发系统开发经验优先'
    ],
    benefits: [
      '15薪，年度绩效奖金',
      '租房补贴',
      '免费三餐',
      '健身房、游戏室',
      '定期技术分享'
    ]
  },
  {
    id: 3,
    name: '前端开发工程师',
    company: '阿里巴巴',
    salary: '20-35K',
    location: '杭州',
    tags: ['React', 'Webpack', '性能优化'],
    salaryBreakdown: {
      base: '20-30K/月',
      bonus: '4-6个月年终奖',
      stock: '集团股票'
    },
    companyDesc: '阿里巴巴集团是全球最大的零售商业体之一，涵盖电商、云计算、数字娱乐等业务板块。拥有完善的技术体系和开源生态，是前端工程师成长的理想平台。',
    careerPath: [
      { title: 'P5 前端工程师', year: '0-3年' },
      { title: 'P6 高级前端', year: '3-5年' },
      { title: 'P7 技术专家', year: '5-8年' },
      { title: 'P8 高级技术专家', year: '8年+' }
    ],
    responsibilities: [
      '负责淘宝/天猫前端业务开发',
      '参与前端工程化建设',
      '推动前端性能优化',
      '构建可复用的组件库',
      '指导新人成长'
    ],
    requirements: [
      '本科及以上学历',
      '1-3年前端开发经验',
      '精通React/Redux',
      '熟悉Webpack/Vite等构建工具',
      '有大型电商项目经验优先'
    ],
    benefits: [
      '五险一金，补充商业保险',
      '餐补、交通补贴',
      '年度旅游基金',
      '内部培训课程',
      '晋升空间大'
    ]
  },
  {
    id: 4,
    name: '后端开发工程师',
    company: '华为',
    salary: '25-45K',
    location: '深圳',
    tags: ['Java', '微服务', '分布式'],
    salaryBreakdown: {
      base: '25-40K/月',
      bonus: '4-8个月年终奖',
      stock: 'TUP虚拟股票'
    },
    companyDesc: '华为是全球领先的ICT基础设施和智能终端提供商，业务遍及170多个国家和地区。技术实力雄厚，在5G、云计算、人工智能等领域持续创新，为工程师提供参与顶尖项目的机会。',
    careerPath: [
      { title: '13-14级 开发工程师', year: '0-3年' },
      { title: '15-16级 高级工程师', year: '3-6年' },
      { title: '17-18级 架构师', year: '6-10年' },
      { title: '19级+ 首席架构师', year: '10年+' }
    ],
    responsibilities: [
      '负责核心业务系统的后端开发',
      '设计高可用、高并发的分布式架构',
      '参与微服务架构设计与实施',
      '优化数据库性能和系统稳定性',
      '编写技术文档，参与代码评审'
    ],
    requirements: [
      '本科及以上学历，计算机相关专业',
      '3年以上Java后端开发经验',
      '精通Spring Cloud微服务框架',
      '熟悉MySQL、Redis、Kafka等中间件',
      '有分布式系统设计经验优先'
    ],
    benefits: [
      '高薪+TUP虚拟股票',
      '海外出差机会',
      '完善的培训体系',
      '健康管理中心',
      '子女教育补贴'
    ]
  },
  {
    id: 5,
    name: '数据分析师',
    company: '拼多多',
    salary: '22-38K',
    location: '上海',
    tags: ['Python', 'SQL', '机器学习'],
    salaryBreakdown: {
      base: '22-35K/月',
      bonus: '3-5个月年终奖',
      stock: '期权激励'
    },
    companyDesc: '拼多多是中国领先的农业和日用品电商平台，以技术创新驱动业务高速增长。公司重视数据驱动决策，数据分析团队在公司战略制定中发挥着核心作用。',
    careerPath: [
      { title: '初级数据分析师', year: '0-2年' },
      { title: '高级数据分析师', year: '2-4年' },
      { title: '数据分析专家', year: '4-7年' },
      { title: '数据科学总监', year: '7年+' }
    ],
    responsibilities: [
      '负责业务数据的收集、清洗和分析',
      '构建数据看板和自动化报表',
      '开展A/B测试，驱动业务决策',
      '挖掘数据价值，发现业务增长点',
      '与产品、运营团队紧密协作'
    ],
    requirements: [
      '本科及以上学历，统计/数学/计算机相关专业',
      '2年以上数据分析经验',
      '精通Python、SQL',
      '熟悉Tableau/PowerBI等BI工具',
      '有电商数据分析经验优先'
    ],
    benefits: [
      '有竞争力的薪资',
      '期权激励计划',
      '免费三餐',
      '弹性工作制',
      '快速晋升通道'
    ]
  },
  {
    id: 6,
    name: '产品经理',
    company: '网易',
    salary: '20-35K',
    location: '杭州',
    tags: ['B端产品', '用户研究', '数据分析'],
    salaryBreakdown: {
      base: '20-30K/月',
      bonus: '3-5个月年终奖',
      stock: '集团股票'
    },
    companyDesc: '网易是中国领先的互联网技术公司，旗下拥有网易游戏、网易云音乐、网易有道等知名产品。公司以产品驱动著称，注重用户体验和产品创新，是产品经理成长的沃土。',
    careerPath: [
      { title: '产品经理', year: '0-2年' },
      { title: '高级产品经理', year: '2-5年' },
      { title: '产品总监', year: '5-8年' },
      { title: 'VP', year: '8年+' }
    ],
    responsibilities: [
      '负责B端产品的规划和设计',
      '撰写产品需求文档和交互原型',
      '进行用户调研和竞品分析',
      '推动产品迭代和数据驱动优化',
      '协调设计、开发、测试团队'
    ],
    requirements: [
      '本科及以上学历',
      '2年以上产品经理经验',
      '优秀的逻辑思维和沟通能力',
      '熟悉产品设计工具(Axure/Figma)',
      '有B端产品经验优先'
    ],
    benefits: [
      '五险一金+补充医疗',
      '猪厂食堂',
      '健身房、游泳池',
      '年度旅游',
      '内部创业机会'
    ]
  },
  {
    id: 7,
    name: 'UI/UX设计师',
    company: '小红书',
    salary: '18-30K',
    location: '上海',
    tags: ['Figma', '设计系统', '用户研究'],
    salaryBreakdown: {
      base: '18-28K/月',
      bonus: '2-4个月年终奖',
      stock: '期权激励'
    },
    companyDesc: '小红书是中国领先的生活方式社区平台，月活用户超过2亿。公司高度重视设计体验，设计团队在产品迭代中拥有核心话语权，为设计师提供了充分的创作自由和成长空间。',
    careerPath: [
      { title: '初级设计师', year: '0-2年' },
      { title: '高级设计师', year: '2-4年' },
      { title: '设计专家', year: '4-7年' },
      { title: '设计总监', year: '7年+' }
    ],
    responsibilities: [
      '负责产品界面的视觉设计和交互优化',
      '参与设计系统的建设和维护',
      '开展用户研究，验证设计方案',
      '与产品经理和开发团队紧密协作',
      '关注设计趋势，推动设计创新'
    ],
    requirements: [
      '本科及以上学历，设计相关专业',
      '2年以上UI/UX设计经验',
      '精通Figma/Sketch等设计工具',
      '有完整项目设计经验',
      '优秀的审美和设计素养'
    ],
    benefits: [
      '弹性工作制',
      '设计工具补贴',
      '年度设计大会',
      '健康体检',
      '下午茶文化'
    ]
  },
  {
    id: 8,
    name: '测试开发工程师',
    company: '京东',
    salary: '18-30K',
    location: '北京',
    tags: ['自动化测试', '性能测试', 'Python'],
    salaryBreakdown: {
      base: '18-28K/月',
      bonus: '3-5个月年终奖',
      stock: '集团股票'
    },
    companyDesc: '京东是中国领先的技术驱动型电商和零售基础设施服务商，拥有庞大的物流和技术体系。测试开发团队在保障京东万亿级交易系统中发挥着关键作用，技术挑战和发展空间巨大。',
    careerPath: [
      { title: '测试开发工程师', year: '0-2年' },
      { title: '高级测试开发', year: '2-5年' },
      { title: '测试架构师', year: '5-8年' },
      { title: '质量保障总监', year: '8年+' }
    ],
    responsibilities: [
      '负责自动化测试框架的设计和开发',
      '编写和维护自动化测试用例',
      '开展性能测试和安全测试',
      '推动持续集成和持续交付',
      '保障产品质量和发布效率'
    ],
    requirements: [
      '本科及以上学历，计算机相关专业',
      '2年以上测试开发经验',
      '精通Python/Java编程',
      '熟悉Selenium/Appium等测试框架',
      '有CI/CD经验优先'
    ],
    benefits: [
      '五险一金+补充医疗',
      '京东内购优惠',
      '年度体检',
      '带薪年假',
      '技术培训计划'
    ]
  },
  {
    id: 9,
    name: '算法工程师',
    company: '百度',
    salary: '35-55K',
    location: '北京',
    tags: ['NLP', '深度学习', '大模型'],
    salaryBreakdown: {
      base: '35-50K/月',
      bonus: '4-6个月年终奖',
      stock: '集团股票'
    },
    companyDesc: '百度是全球最大的中文搜索引擎和领先的AI公司，在自然语言处理、计算机视觉、自动驾驶等领域处于行业领先地位。文心大模型的研发为算法工程师提供了前沿的技术平台。',
    careerPath: [
      { title: '算法工程师', year: '0-3年' },
      { title: '高级算法工程师', year: '3-5年' },
      { title: '算法专家', year: '5-8年' },
      { title: '首席科学家', year: '8年+' }
    ],
    responsibilities: [
      '负责大模型训练和优化',
      '开展NLP/推荐算法研究和落地',
      '设计高效的深度学习架构',
      '推动AI技术在业务场景中的应用',
      '发表高水平学术论文'
    ],
    requirements: [
      '硕士及以上学历，计算机/AI相关专业',
      '3年以上算法开发经验',
      '精通PyTorch/TensorFlow',
      '熟悉Transformer架构',
      '有顶会论文发表经验优先'
    ],
    benefits: [
      '顶级算力资源',
      '学术会议赞助',
      '股票激励计划',
      '弹性工作制',
      '国际化学术氛围'
    ]
  }
])

// 打开岗位详情
const openJobDetail = (job) => {
  currentJob.value = job
  showJobModal.value = true
}
</script>

<style scoped>
.home-page {
  padding-top: 64px;
}

/* Banner */
.banner {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.banner h1 {
  font-size: 48px;
  color: #fff;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
}

.banner-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.banner-illustration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-card {
  position: absolute;
  font-size: 48px;
  animation: float 3s ease-in-out infinite;
}

.card1 { top: 20%; left: 10%; animation-delay: 0s; }
.card2 { top: 30%; right: 15%; animation-delay: 0.5s; }
.card3 { bottom: 25%; left: 20%; animation-delay: 1s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* 快捷入口 */
.quick-entry {
  padding: 60px 0;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.quick-entry h2, .features h2, .hot-jobs h2 {
  font-size: 28px;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.entry-item {
  background: #f8f8f8;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.entry-item:hover {
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.entry-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.entry-item h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.entry-item p {
  font-size: 14px;
  color: #999;
}

/* 核心功能 */
.features {
  padding: 60px 0;
  background: #f5f5f5;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 60px;
}

.feature-item.reverse {
  flex-direction: row-reverse;
}

.feature-content {
  flex: 1;
}

.feature-content h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
}

.feature-content p {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
}

.feature-preview {
  flex: 1;
}

.mock-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.mock-header {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
}

.mock-tags {
  display: flex;
  gap: 8px;
}

.mock-tag {
  padding: 4px 12px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  border-radius: 12px;
  font-size: 12px;
}

.mock-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mock-note {
  background: #fff;
  border-radius: 8px;
  padding: 20px 16px;
  text-align: center;
  font-size: 14px;
  color: #666;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.mock-list {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.mock-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
}

.mock-item:last-child {
  border-bottom: none;
}

/* 热门岗位 */
.hot-jobs {
  padding: 60px 0;
  background: #fff;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.job-card {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
  cursor: pointer;
}

.job-card:hover {
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.job-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.job-salary {
  font-size: 16px;
  color: #2563eb;
  font-weight: 600;
}

.job-company {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.job-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.job-tag {
  padding: 4px 10px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  border-radius: 10px;
  font-size: 12px;
}

/* 岗位详情弹窗样式 */
.job-detail {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.job-detail::-webkit-scrollbar {
  width: 4px;
}

.job-detail::-webkit-scrollbar-thumb {
  background: #d0d5dd;
  border-radius: 2px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.job-location {
  font-size: 14px;
  color: #666;
}

.job-salary-large {
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-list li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.detail-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b82f6;
}

/* 薪资构成 */
.salary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.salary-item {
  background: #f0f7ff;
  border-radius: 10px;
  padding: 14px 16px;
  text-align: center;
  border: 1px solid #dbeafe;
}

.salary-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
}

.salary-value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
}

/* 公司介绍 */
.company-intro {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px;
  border-left: 3px solid #3b82f6;
}

/* 职业发展路径 */
.career-timeline {
  display: flex;
  gap: 0;
  position: relative;
  padding: 8px 0;
}

.career-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.career-step::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #dbeafe;
}

.career-step:last-child::after {
  display: none;
}

.career-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #dbeafe;
  border: 3px solid #3b82f6;
  position: relative;
  z-index: 1;
  margin-bottom: 10px;
}

.career-dot.active {
  background: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.career-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.career-title {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.career-year {
  font-size: 11px;
  color: #9ca3af;
}

/* 相关岗位推荐 */
.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.related-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.related-card:hover {
  border-color: #3b82f6;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.related-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.related-company {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
}

.related-salary {
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
}

/* 底部按钮 */
.detail-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .entry-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-item {
    flex-direction: column;
  }

  .feature-item.reverse {
    flex-direction: column;
  }

  .salary-grid {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .career-timeline {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding-left: 24px;
  }

  .career-step {
    flex-direction: row;
    gap: 12px;
  }

  .career-step::after {
    display: none;
  }
}
</style>
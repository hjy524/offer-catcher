<template>
  <div class="diagnose-detail-page">
    <div class="container">
      <div class="page-header">
        <el-button text @click="goBack">← 返回</el-button>
        <h1>📄 诊断报告详情</h1>
      </div>

      <div v-if="report" class="report-card">
        <div class="report-header">
          <div class="report-score">
            <span class="score-value" :class="scoreLevel">{{ report.score }}</span>
            <span class="score-label">匹配度</span>
          </div>
          <div class="report-meta">
            <span class="report-date">{{ report.date }}</span>
            <span class="report-title">{{ report.jdTitle || '简历诊断' }}</span>
          </div>
        </div>

        <div v-if="report.jdContent" class="report-section">
          <h3>📋 职位描述</h3>
          <p class="jd-content">{{ report.jdContent }}</p>
        </div>

        <div class="report-section">
          <h3>✅ 达标项</h3>
          <ul v-if="report.meetItems && report.meetItems.length">
            <li v-for="(item, i) in report.meetItems" :key="i" class="meet-item">{{ item }}</li>
          </ul>
          <p v-else class="no-data">暂无达标项</p>
        </div>

        <div class="report-section">
          <h3>❌ 缺失项</h3>
          <ul v-if="report.missingItems && report.missingItems.length">
            <li v-for="(item, i) in report.missingItems" :key="i" class="missing-item">{{ item }}</li>
          </ul>
          <p v-else class="no-data">暂无缺失项</p>
        </div>

        <div class="report-section">
          <h3>💡 优化建议</h3>
          <ul v-if="report.suggestions && report.suggestions.length">
            <li v-for="(item, i) in report.suggestions" :key="i" class="suggest-item">{{ item }}</li>
          </ul>
          <p v-else class="no-data">暂无优化建议</p>
        </div>

        <div v-if="report.content" class="report-section">
          <h3>📝 优化后简历</h3>
          <pre class="optimized-content">{{ report.content }}</pre>
        </div>

        <div class="report-footer">
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📄</div>
        <p>诊断报告不存在</p>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const report = ref(null)
const allReports = ref([])

const scoreLevel = computed(() => {
  if (!report.value) return ''
  const s = report.value.score
  if (s >= 80) return 'high'
  if (s >= 60) return 'medium'
  return 'low'
})

const goBack = () => {
  router.push('/user')
}

onMounted(() => {
  allReports.value = userStore.loadDiagnoseHistory() || []
  const idx = Number(route.params.index)
  if (!isNaN(idx) && idx >= 0 && idx < allReports.value.length) {
    report.value = allReports.value[idx]
  }
})
</script>

<style scoped>
.diagnose-detail-page {
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
  margin: 8px 0 0;
}

.report-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.report-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.report-score {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-value {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
}

.score-value.high { color: #10b981; }
.score-value.medium { color: #f59e0b; }
.score-value.low { color: #ef4444; }

.score-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.report-meta {
  flex: 1;
}

.report-date {
  display: block;
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.report-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.report-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f5f5f5;
}

.report-section:last-of-type {
  border-bottom: none;
}

.report-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.report-section ul {
  padding-left: 20px;
}

.report-section li {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 6px;
  color: #555;
}

.meet-item { color: #10b981 !important; }
.missing-item { color: #ef4444 !important; }
.suggest-item { color: #2563eb !important; }

.jd-content {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.optimized-content {
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  color: #333;
}

.no-data {
  color: #999;
  font-size: 14px;
}

.report-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 16px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
  margin-bottom: 16px;
}
</style>

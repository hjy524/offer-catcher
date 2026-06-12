<template>
  <div class="ai-float-btn" @click="$router.push('/ai-consult')">
    <div class="btn-icon">🤖</div>
    <span class="btn-text">AI职业咨询</span>
  </div>
</template>

<script setup>
</script>

<style scoped>
.ai-float-btn {
  position: fixed;
  right: 30px;
  bottom: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: #fff;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(30, 64, 175, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
}

.ai-float-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(30, 64, 175, 0.5);
}

.btn-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon el-icon {
  font-size: 18px;
}

.btn-text {
  font-size: 14px;
  font-weight: 500;
}
</style>
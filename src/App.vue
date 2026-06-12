<template>
  <div class="app-container">
    <NavHeader />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <AIFloatButton />
    <Footer />
  </div>
</template>

<script setup>
import NavHeader from '@/components/NavHeader.vue'
import AIFloatButton from '@/components/AIFloatButton.vue'
import Footer from '@/components/Footer.vue'
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
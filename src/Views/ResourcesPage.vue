<template>
  <div class="res-main">
    <AppNavDesktop v-if="isDesktop" class="nav-desktop" />
    <div class="res-content"></div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import AppNavDesktop from '@/components/AppNavDesktop.vue'
import { useBreakpoints } from '@vueuse/core'

const navItems = [
  { id: 'hardware', label: '硬件' },
  { id: 'software', label: '软件' },
  { id: 'game', label: '游戏' },
  { id: 'website', label: '网站' },
  { id: 'system', label: '系统' },
]

// 响应式断点
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
const isDesktop = screens.greaterOrEqual('desktop')
</script>

<style scoped>
.nav-desktop {
  width: 564px;
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.res-content {
  height: 1024px;
  margin: 0 auto;
}

@media (width>=1024px) {
  .res-content {
    margin: 60px auto;
  }
}
</style>

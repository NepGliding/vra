<template>
  <div class="res-main">
    <AppNavMobile v-if="!isDesktop" class="nav-mobile" />
    <AppNavDesktop v-if="isDesktop" class="nav-desktop" />
    <div class="res-content">内容测试</div>
  </div>
</template>

<script setup>
import AppNavMobile from '@/components/AppNavMobile.vue'
import AppNavDesktop from '@/components/AppNavDesktop.vue'
import { useBreakpoints } from '@vueuse/core'

const navItems = [
  { id: 'hardware', label: '硬件', label_en: 'Hardware' },
  { id: 'software', label: '软件', label_en: 'Software' },
  { id: 'game', label: '游戏', label_en: 'Game' },
  { id: 'website', label: '网站', label_en: 'Website' },
  { id: 'system', label: '系统', label_en: 'System' },
]

//响应式断点
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
// const isMobile = screens.smaller('tablet')
// const isTablet = screens.between('mobile', 'desktop')
const isDesktop = screens.greaterOrEqual('desktop')
</script>

<style scoped>
/* .res-main {
  height: 1024px;
} */
.res-content {
  height: 2000px;
  background-color: rgba(225, 255, 255, 0.5);
  /* margin: 40px 200px; */
}
.nav-mobile {
  position: fixed;
  top: 80px;
  left: 6px;
}
.nav-desktop {
  width: 564px;
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}
</style>

<template>
  <div class="res-main">
    <AppNavMobile v-if="!isDesktop" class="nav-mobile" />
    <AppNavDesktop v-if="isDesktop" class="nav-desktop" />
    <button @click="toggleDark" class="theme-toggle">调试切换主题{{ isDark ? '☀️' : '🌙' }}</button>
  </div>
</template>

<script setup>
import AppNavMobile from '@/components/AppNavMobile.vue'
import AppNavDesktop from '@/components/AppNavDesktop.vue'
import { useTheme } from '@/utils/useTheme'
import { useBreakpoints } from '@vueuse/core'

//主题切换
const { isDark, toggleDark } = useTheme()

//响应式断点
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
// const isMobile = screens.smaller('tablet')
// const isTablet = screens.between('mobile', 'desktop')
const isDesktop = screens.greaterOrEqual('desktop')
</script>

<style scoped>
.res-main {
  height: 1024px;
}
.nav-mobile {
  position: fixed;
  top: 80px;
  left: 6px;
}
.nav-desktop {
  width: 564px;
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
}

.theme-toggle {
  position: absolute;
  top: 100px;
  right: 50%;
}
</style>

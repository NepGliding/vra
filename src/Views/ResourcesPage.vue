<template>
  <AppNav v-if="isMobile" class="nav-mobile" />

  <div class="res-main">
    <button @click="toggleDark" class="theme-toggle">
      {{ isDark ? '☀️' : '🌙' }}
    </button>
  </div>
</template>

<script setup>
import AppNav from '@/components/AppNav.vue'
import { useTheme } from '@/utils/useTheme'
import { useBreakpoints } from '@vueuse/core'

//主题切换
const { isDark, toggleDark } = useTheme()

// ---------- 响应式断点 ----------
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
const isMobile = screens.smaller('tablet')
const isTablet = screens.between('mobile', 'desktop')
const isDesktop = screens.greaterOrEqual('desktop')
</script>

<style scoped>
.nav-mobile {
  position: fixed;
  top: 80px;
  left: 6px;
}
.res-main {
  width: 100vw;
  height: 1024px;
  /* background: #aaeeface; */
  padding: 16px 60px;
}
.theme-toggle {
  position: absolute;
  top: 100px;
  right: 60px;
}
</style>

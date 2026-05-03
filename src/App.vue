<template>
  <header class="header-top">
    <AppHeader />
  </header>

  <main class="main-center">
    <!-- 直接渲染，动画由 View Transitions 接管 -->
    <router-view class="child-view" />
  </main>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import { useViewTransitionRouter } from '@/utils/useViewTransitionRouter'

// 启用 View Transitions 路由过渡
useViewTransitionRouter()
</script>

<style scoped>
.header-top {
  position: fixed;
  top: 0;
  left: 16px;
  right: 16px;
  z-index: 10;
  view-transition-name: none; /* none头部参与过渡 */
}

.main-center {
  z-index: 1;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  padding-top: calc(var(--header-height, 60px) + 16px);
}

.child-view {
  view-transition-name: page;
  position: absolute;
  width: 100%;
  overflow: hidden;
}
</style>

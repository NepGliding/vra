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
  view-transition-name: none; /* 不让头部参与过渡 */
}

.main-center {
  z-index: 1;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  padding-top: calc(var(--header-height, 60px) + 16px);
}

.child-view {
  view-transition-name: page; /* 关键：统一过渡名称 */
  position: absolute;
  width: 100%;
  overflow: hidden;
}
</style>

<!-- 全局过渡样式（不变） -->
<style>
::view-transition-old(page) {
  animation: slide-out 0.8s cubic-bezier(0.55, 0, 0.1, 1) forwards;
}
::view-transition-new(page) {
  animation: slide-in 0.8s cubic-bezier(0.55, 0, 0.1, 1) forwards;
}
@keyframes slide-out {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(50px);
  }
}
@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
::view-transition-old(page),
::view-transition-new(page) {
  z-index: 2;
}
</style>

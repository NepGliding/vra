<!-- <template>
  <header class="header-top">
    <AppHeader />
  </header>
  <main class="main-center">
    <router-view class="child-view" />
  </main>
</template> -->
<template>
  <header class="header-top">
    <AppHeader />
  </header>
  <main class="main-center">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" class="child-view" />
      </transition>
    </router-view>
  </main>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import { useViewTransitionRouter } from '@/utils/useViewTransitionRouter'

// 启用 View Transitions 路由过渡
// useViewTransitionRouter()
</script>

<style scoped>
.header-top {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  view-transition-name: none;
}

.main-center {
  z-index: 1;
  position: relative;
  min-height: 100vh;
  padding-top: 64px;
}

.child-view {
  view-transition-name: page;
  width: 100%;
}
</style>

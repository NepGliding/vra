<template>
  <AppNav class="nav-left" />

  <div class="res-main">
    <button @click="toggleDark" class="theme-toggle">
      {{ isDark ? '☀️' : '🌙' }}
    </button>
  </div>
</template>

<script setup>
import AppNav from '@/components/AppNav.vue'
import { useTheme } from '@/utils/useTheme'
const { isDark, toggleDark } = useTheme()
</script>

<style scoped>
.nav-left {
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

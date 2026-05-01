<template>
  <header class="header-top">
    <AppHeader />
  </header>
  <main class="main-center">
    <router-view />
  </main>
</template>
<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
.header-top {
  position: fixed;
  top: 0;
  left: 16px;
  right: 16px;
  z-index: 10;
}
.main-center {
  z-index: 5;
}
</style>

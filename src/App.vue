<template>
  <header>
    <AppHeader />
  </header>
  <main>
    <router-view />
  </main>
</template>
<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 16px;
  right: 16px;
}
</style>

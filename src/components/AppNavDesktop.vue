<template>
  <div class="nav-desktop-main" ref="containerRef">
    <!-- 底部水平高亮指示器 -->
    <div class="active-indicator"></div>
    <button
      v-for="(item, index) in navItems"
      :key="item.id"
      :ref="(el) => setButtonRef(el, index)"
      :class="{ active: activeId === item.id }"
      @click="handleNavClick(item)"
    >
      <component
        :is="item.icon"
        :fillColor="activeId === item.id ? 'var(--bg-base)' : 'var(--text-secondary)'"
      />
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HardwareSVG from '@/assets/icon/HardwareSVG.vue'
import SoftwareSVG from '@/assets/icon/SoftwareSVG.vue'
import GameSVG from '@/assets/icon/GameSVG.vue'
import WebsiteSVG from '@/assets/icon/WebsiteSVG.vue'
import SystemSVG from '@/assets/icon/SystemSVG.vue'

const navItems = [
  { id: 'hardware', label: '硬件', icon: HardwareSVG },
  { id: 'software', label: '软件', icon: SoftwareSVG },
  { id: 'game', label: '游戏', icon: GameSVG },
  { id: 'website', label: '网站', icon: WebsiteSVG },
  { id: 'system', label: '系统', icon: SystemSVG },
]

const activeId = ref(navItems[0].id)
const buttonRefs = ref([])
const setButtonRef = (el, index) => {
  if (el) buttonRefs.value[index] = el
}

const handleNavClick = (item) => {
  activeId.value = item.id
  console.log('点击了：', item.label)
}
</script>

<style scoped>
.nav-desktop-main {
  position: relative;
  display: flex;
  gap: 1em;
  background-color: transparent;
}

.nav-desktop-main button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--bg-sidebar);
  border: none;
  cursor: pointer;
  padding: 8px 4px;
  width: 100px;
  height: 38px;
  box-shadow: 0 0 0 1px gray;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  border-radius: 24px;
}

.nav-desktop-main button:hover {
  box-shadow: 0 0 0 2px var(--text-primary);
}
.nav-desktop-main button.active {
  background-color: var(--text-primary);
}
.nav-label {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
}

.nav-desktop-main button.active .nav-label {
  color: var(--bg-base);
}
</style>

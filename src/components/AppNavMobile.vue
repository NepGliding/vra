<template>
  <div class="nav-mobile-main" ref="containerRef">
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
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useElementBounding } from '@vueuse/core'
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
const containerRef = ref(null)

// 按钮元素引用数组
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
.nav-mobile-main {
  width: 60px;
  height: 300px;
  position: relative;
  display: grid;
  grid-auto-flow: row;
  gap: 4px;
  align-items: center;
  justify-items: center;
  border-radius: 5px;
  border: 1px solid #46433f;
}

.nav-mobile-main button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
  width: 90%;
  aspect-ratio: 1 / 1;
  border-radius: 5px;
  transition: background-color 0.2s;
  z-index: 0;
}
.nav-mobile-main button.active {
  background-color: var(--text-primary);
}
/* 激活状态的按钮隐藏文字描述 */
/* .main button.active .nav-label {
  display: none;
} */
/* 图标切换动画（已移除功能，保留注释） */
/* .icon-switch-leave-active {
  transition: opacity 0.2s ease;
  transform: 0.2s ease;
}
.icon-switch-leave-to {
  opacity: 0;
  transform: scale(0.8);
} */

/* 进入动画：仅淡入，保持正常尺寸 */
/* .icon-switch-enter-active {
  transition: opacity 0.2s ease;
}
.icon-switch-enter-from {
  opacity: 0;
} */
</style>

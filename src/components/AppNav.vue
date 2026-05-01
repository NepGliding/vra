<template>
  <div class="nav-mobile-main" ref="containerRef">
    <!-- 独立的高亮指示器（左边框蓝条） -->
    <div class="active-indicator" :style="indicatorStyle"></div>

    <button
      v-for="(item, index) in navItems"
      :key="item.id"
      :ref="(el) => setButtonRef(el, index)"
      :class="{ active: activeId === item.id }"
      @click="handleNavClick(item)"
    >
      <Transition name="icon-switch" mode="out-in">
        <component
          :key="activeId === item.id ? 'active' : 'normal'"
          :is="activeId === item.id ? item.activeIcon : item.icon"
        />
      </Transition>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useElementBounding } from '@vueuse/core'
import HardwareSVG from '@/assets/icon/HardwareSVG.vue'
import HardwareSVG2 from '@/assets/icon/HardwareSVG2.vue'
import SoftwareSVG from '@/assets/icon/SoftwareSVG.vue'
import SoftwareSVG2 from '@/assets/icon/SoftwareSVG2.vue'
import GameSVG from '@/assets/icon/GameSVG.vue'
import GameSVG2 from '@/assets/icon/GameSVG2.vue'
import WebsiteSVG from '@/assets/icon/WebsiteSVG.vue'
import WebsiteSVG2 from '@/assets/icon/WebsiteSVG2.vue'
import SystemSVG from '@/assets/icon/SystemSVG.vue'
import SystemSVG2 from '@/assets/icon/SystemSVG2.vue'

const navItems = [
  { id: 'hardware', label: '硬件', icon: HardwareSVG, activeIcon: HardwareSVG2 },
  { id: 'software', label: '软件', icon: SoftwareSVG, activeIcon: SoftwareSVG2 },
  { id: 'game', label: '游戏', icon: GameSVG, activeIcon: GameSVG2 },
  { id: 'website', label: '网站', icon: WebsiteSVG, activeIcon: WebsiteSVG2 },
  { id: 'system', label: '系统', icon: SystemSVG, activeIcon: SystemSVG2 },
]

const activeId = ref(navItems[0].id)
const containerRef = ref(null)

// 按钮元素引用数组
const buttonRefs = ref([])
const setButtonRef = (el, index) => {
  if (el) buttonRefs.value[index] = el
}

// 当前激活按钮对应的 DOM 元素
const activeButtonElement = computed(() => {
  const idx = navItems.findIndex((item) => item.id === activeId.value)
  return buttonRefs.value[idx] ?? null
})

// 使用 VueUse 获取按钮和容器的边界信息
const { top: btnTop, height: btnHeight } = useElementBounding(activeButtonElement)
const { top: containerTop } = useElementBounding(containerRef)

// 根据响应式边界值计算指示器样式
const indicatorStyle = computed(() => {
  if (!btnHeight.value) return { top: '0px', height: '0px' }
  const h = btnHeight.value * 0.38
  const relativeTop = btnTop.value - containerTop.value + (btnHeight.value - h) / 2
  return {
    top: `${relativeTop}px`,
    height: `${h}px`,
  }
})

const handleNavClick = (item) => {
  activeId.value = item.id
  console.log('点击了：', item.label)
}
</script>

<style scoped>
.nav-mobile-main {
  width: 60px;
  height: 60px;
  position: relative;
  display: grid;
  grid-auto-flow: row;
  gap: 4px;
  align-items: center;
  justify-items: center;
}

.active-indicator {
  position: absolute;
  left: 0;
  width: 4px;
  background-color: var(--bg-hover);
  border-radius: 2px;
  transition:
    top 0.3s ease,
    height 0.3s ease;
  pointer-events: none;
  z-index: 1;
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

.nav-mobile-main button:hover {
  background-color: var(--bg-surface);
}

.nav-mobile-main button.active {
  background: transparent;
}

.nav-label {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1px;
  text-align: center;
  font-size: 11px;
  color: var(--text-secondary, #888);
  line-height: 1.2;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
}
/* 激活状态的按钮隐藏文字描述 */
/* .main button.active .nav-label {
  display: none;
} */
/* 图标切换动画 */
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

<template>
  <div class="header-main">
    <div
      class="switch-pages"
      @mouseenter="showPopover"
      @mouseleave="delayHidePopover"
      @click="toggleDrawer"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 6L43 25L24 27L13.9948 44L8 6Z"
          fill="var(--text-primary)"
          stroke="var(--text-primary)"
          stroke-width="4"
          stroke-linejoin="round"
        />
      </svg>
      <span class="switch-pages-span">切换页面</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="var(--text-secondary)"
      >
        <path
          d="M18.2072 9.0428 12.0001 2.83569 5.793 9.0428 7.20721 10.457 12.0001 5.66412 16.793 10.457 18.2072 9.0428ZM5.79285 14.9572 12 21.1643 18.2071 14.9572 16.7928 13.543 12 18.3359 7.20706 13.543 5.79285 14.9572Z"
        ></path>
      </svg>
    </div>
    <div
      v-if="isDesktop"
      class="switch-pages-popover"
      :class="{ show: popoverVisible }"
      @mouseenter="showPopover"
      @mouseleave="delayHidePopover"
    ></div>
    <div
      v-if="!isDesktop"
      class="switch-pages-drawer"
      :class="{ show: drawerVisible }"
      ref="drawerRef"
    ></div>

    <div class="menu-container">
      <button
        class="hamburger"
        :class="{ active: isMenuOpen }"
        :aria-expanded="isMenuOpen"
        aria-label="切换菜单"
        @click="toggleMenu"
      >
        <div class="hamburger__line"></div>
        <div class="hamburger__line"></div>
        <div class="hamburger__line"></div>
      </button>
      <div class="menu-container-drawer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useBreakpoints, useTimeoutFn, onClickOutside } from '@vueuse/core'

// ---------- 响应式断点 ----------
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
const isMobile = screens.smaller('tablet')
const isTablet = screens.between('mobile', 'desktop')
const isDesktop = screens.greaterOrEqual('desktop')

const drawerVisible = ref(false)
const drawerRef = ref(null)

// 点击切换抽屉（只在非桌面端生效）
const toggleDrawer = () => {
  if (isDesktop.value) return
  drawerVisible.value = !drawerVisible.value
}

// 优雅升级：点击抽屉外部自动关闭
onClickOutside(drawerRef, () => {
  drawerVisible.value = false
})

// 汉堡菜单
const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

//弹窗悬停控制
const popoverVisible = ref(false)
const { start: startHideTimer, stop: stopHideTimer } = useTimeoutFn(() => {
  popoverVisible.value = false
}, 150)
// 显示弹窗（清除任何待执行的隐藏定时器）
const showPopover = () => {
  if (!isDesktop.value) return
  stopHideTimer()
  popoverVisible.value = true
}

// 延迟隐藏（启动隐藏定时器）
const delayHidePopover = () => {
  if (!isDesktop.value) return
  startHideTimer() // 若之前有定时器会自动重置
}
</script>

<style scoped>
.header-main {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.switch-pages {
  width: 135px;
  height: 44px;
  border-radius: 22px;
  /* border: 2px solid #3f3f46; */
  border: 2px solid var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border 0.2s;
}

.switch-pages-popover {
  position: fixed;
  top: 10px;
  left: 16px;
  width: 135px;
  height: 44px;
  border-radius: 22px;
  border: 2px solid #3f3f46;
  visibility: hidden;
  opacity: 0;
  transition: all 0.4s ease;
  z-index: 999;
  background-color: var(--bg-base);
}

/* 显示状态 */
.switch-pages-popover.show {
  width: 320px;
  height: 320px;
  visibility: visible;
  opacity: 1;
}
.switch-pages-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 400px;
  transform: translateY(100%);
  border-radius: 22px 22px 0 0;
  border: 2px solid #3f3f46;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  background-color: var(--bg-base);
}
.switch-pages-drawer.show {
  transform: translateY(0);
}
.switch-pages-span {
  font-size: 14px;
  margin: 0 6px;
}

.menu-container {
  width: 30px;
  height: 30px;
}

.hamburger {
  width: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font: inherit;
  line-height: 1;
  transition: background-color 0.2s ease;
}

.hamburger__line {
  background: var(--text-primary);
  margin: 6px auto;
  height: 2px;
  width: 22px;
  border-radius: 2px;
  transition: all 0.3s ease-out;
}

.hamburger.active .hamburger__line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger.active .hamburger__line:nth-child(2) {
  opacity: 0;
}

.hamburger.active .hamburger__line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
</style>

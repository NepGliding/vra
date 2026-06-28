<template>
  <div class="header-main">
    <button @click="toggleDark" class="theme-toggle">切换主题调试{{ isDark ? '☀️' : '🌙' }}</button>
    <div class="switch-other" ref="switchOtherRef" @click="toggleDrawer">
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
      <span class="switch-other-span">What can I say ?</span>
    </div>
    <div v-if="!isDesktop" class="menu-container" ref="menuContainerRef">
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
    </div>
    <div
      v-if="!isDesktop"
      class="menu-full-mask"
      :class="{ show: isMenuOpen }"
      ref="menuMaskRef"
      @click.self="isMenuOpen = false"
    >
      <button
        v-for="(item, index) in navItems"
        :key="item.key"
        class="page-btn-mobile"
        :class="{ 'page-btn-mobile-active': route.path === item.key }"
        :style="{ '--delay': `${index * 0.1}s` }"
        @click="handleNavClick(item.key)"
      >
        {{ item.label }}
      </button>
    </div>
    <div v-if="isDesktop" class="perch-btn-desktop">
      <VerticalTabsIndicator
        :items="navItems"
        :active-key="route.path"
        indicator-color="var(--bg-hover)"
        indicator-width="4px"
        position="right"
        offset="16px"
        @click="handleDesktopNav"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBreakpoints, useTimeoutFn, onClickOutside } from '@vueuse/core'
import VerticalTabsIndicator from '@/components/VerticalTabsIndicator.vue'

const router = useRouter()
const route = useRoute()

const navItems = [
  { key: '/', label: '资源页' },
  { key: '/article', label: '文章页' },
  { key: '/interesting', label: ' Interesting' },
]

const handleDesktopNav = (item) => {
  router.push(item.key)
}

// ---------- 响应式断点 ----------
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
// const isMobile = screens.smaller('tablet')
// const isTablet = screens.between('mobile', 'desktop')
const isDesktop = screens.greaterOrEqual('desktop')

import { useTheme } from '@/utils/useTheme'
//主题切换
const { isDark, toggleDark } = useTheme()

// 汉堡菜单（只在移动端生效）
const isMenuOpen = ref(false)
const isToggling = ref(false)
const toggleMenu = () => {
  if (isToggling.value) return
  isToggling.value = true
  isMenuOpen.value = !isMenuOpen.value
  setTimeout(() => (isToggling.value = false), 300)
}
//汉堡菜单全屏遮罩（只在移动端生效）
const handleNavClick = (path) => {
  // 先关闭菜单
  isMenuOpen.value = false
  // 等待 Vue 完成 DOM 更新后再跳转
  nextTick(() => {
    router.push(path)
  })
}

// 桌面端按钮高亮指示器
const buttonRefs = ref([])
const setButtonRef = (el, index) => {
  if (el) buttonRefs.value[index] = el
}
// 动态计算指示器的位置和样式
const indicatorStyle = computed(() => {
  const activeIndex = navItems.findIndex((item) => item.path === route.path)
  if (activeIndex === -1 || !buttonRefs.value[activeIndex]) return {}
  const activeButton = buttonRefs.value[activeIndex]
  const indicatorHeight = 18
  return {
    // 自动计算垂直居中的top位置
    top: `${activeButton.offsetTop + (activeButton.offsetHeight - indicatorHeight) / 2}px`,
    height: `${indicatorHeight}px`,
    right: '16px',
    width: '4px',
    backgroundColor: 'var(--bg-hover)',
    borderRadius: '2px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
})
</script>

<style scoped>
.header-main {
  height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px;
  background: var(--bg-base);
}

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20%;
  color: var(--text-primary);
}

.switch-other {
  width: 160px;
  height: 26px;
  border-radius: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.switch-other-span {
  font-size: 16px;
  font-weight: bold;
  margin: 0 6px;
}

.menu-container {
  width: 30px;
  height: 30px;
  position: relative;
  z-index: 999;
}

.menu-full-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: opacity 0.5s ease;
  z-index: 100;
  background-color: var(--bg-base);
  box-sizing: border-box;
  overflow-x: hidden;
  opacity: 0;
  pointer-events: none;

  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 32px;
}

.menu-full-mask.show {
  opacity: 1;
  pointer-events: auto;
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

.page-btn-mobile {
  width: 100%;
  height: 62px;
  font-size: 24px;
  font-weight: bold;
  background: transparent;
  color: var(--text-secondary);
  text-align: right;
  padding-right: 32px;
  opacity: 0;
}

.page-btn-mobile-active {
  color: var(--text-primary);
  /* box-shadow: inset -4px 0 0 0 var(--el-active); */
}

.menu-full-mask.show .page-btn-mobile {
  opacity: 1;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.perch-btn-desktop {
  width: 210px;
  height: 140px;
  position: fixed;
  top: 16px;
  right: 0;
  text-align: right;
}

.page-btn-desktop {
  display: inline-block;
  width: 100%;
  height: 45px;
  font-size: 20px;
  font-weight: bold;
  background: transparent;
  color: var(--text-secondary);
  text-align: right;
  transition: color 0.3s ease;
  cursor: pointer;
}

.page-btn-desktop:hover {
  color: var(--text-primary);
}

.perch-btn-desktop .button-group {
  position: relative;
}

.active-indicator {
  position: absolute;
  pointer-events: none; /* 防止指示器阻挡按钮点击 */
  z-index: 1;
}

/* @media (width<=1024px) {
} */
</style>

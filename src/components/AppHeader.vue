<template>
  <div class="header-main">
    <button @click="toggleDark" class="theme-toggle">切换主题调试{{ isDark ? '☀️' : '🌙' }}</button>
    <div
      class="switch-other"
      ref="switchOtherRef"
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
      <span class="switch-other-span">Just a Vite App </span>
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="var(--text-secondary)"
      >
        <path
          d="M18.2072 9.0428 12.0001 2.83569 5.793 9.0428 7.20721 10.457 12.0001 5.66412 16.793 10.457 18.2072 9.0428ZM5.79285 14.9572 12 21.1643 18.2071 14.9572 16.7928 13.543 12 18.3359 7.20706 13.543 5.79285 14.9572Z"
        ></path>
      </svg> -->
    </div>
    <div
      v-if="isDesktop"
      class="switch-other-popover"
      ref="popoverRef"
      :class="{ show: popoverVisible }"
      @mouseenter="showPopover"
      @mouseleave="delayHidePopover"
    ></div>
    <div
      v-if="!isDesktop"
      class="switch-other-drawer"
      :class="{ show: drawerVisible }"
      ref="drawerRef"
    ></div>

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
        :key="item.path"
        class="page-btn-mobile"
        :class="{ 'page-btn-active': route.path === item.path }"
        :style="{ '--delay': `${index * 0.1}s` }"
        @click="handleNavClick(item.path)"
      >
        {{ item.name }}
      </button>
    </div>
    <div v-if="isDesktop" class="perch-btn-desktop">
      <div class="button-group">
        <!-- 高亮指示器元素 -->
        <div class="active-indicator" :style="indicatorStyle"></div>
        <button
          v-for="(item, index) in navItems"
          :key="item.path"
          :ref="(el) => setButtonRef(el, index)"
          class="page-btn-desktop"
          :class="{ 'page-btn-active': route.path === item.path }"
          @click="router.push(item.path)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBreakpoints, useTimeoutFn, onClickOutside } from '@vueuse/core'

const router = useRouter()
const route = useRoute()

const navItems = [
  { path: '/', name: '资源页' },
  { path: '/article', name: '文章页' },
  { path: '/interesting', name: ' Interesting' },
]

// ---------- 响应式断点 ----------
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
// const isMobile = screens.smaller('tablet')
// const isTablet = screens.between('mobile', 'desktop')
const isDesktop = screens.greaterOrEqual('desktop')

import { useTheme } from '@/utils/useTheme'
//主题切换
const { isDark, toggleDark } = useTheme()

// Other抽屉（只在移动端生效）
const drawerVisible = ref(false)
const drawerRef = ref(null)
const toggleDrawer = () => {
  if (isDesktop.value) return
  drawerVisible.value = !drawerVisible.value
}
onClickOutside(drawerRef, () => {
  drawerVisible.value = false
})

//Other弹窗悬停时弹出盒子（只在桌面端生效）
const popoverVisible = ref(false)
const { start: startHideTimer, stop: stopHideTimer } = useTimeoutFn(() => {
  popoverVisible.value = false
}, 150)
const showPopover = () => {
  if (!isDesktop.value) return
  stopHideTimer()
  popoverVisible.value = true
}
const delayHidePopover = () => {
  if (!isDesktop.value) return
  startHideTimer()
}

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
//点击遮罩外部触发关闭遮罩
// const menuMaskRef = ref(null)
// const menuContainerRef = ref(null)
// onClickOutside(
//   menuMaskRef,
//   () => {
//     isMenuOpen.value = false
//   },
//   {
//     ignore: [menuContainerRef],
//   },
// )
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
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  background-color: transparent;
  box-shadow: 0 1px 0 0 #46433f83;
}

.theme-toggle {
  position: absolute;
  top: 80px;
  right: 10%;
  color: var(--text-primary);
}

.switch-other {
  width: 150px;
  height: 44px;
  border-radius: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.switch-other-popover {
  position: fixed;
  top: 10px;
  left: 16px;
  width: 135px;
  height: 44px;
  border-radius: 22px;
  border: 2px solid #46433f;
  visibility: hidden;
  opacity: 0;
  transition: all 0.38s ease;
  z-index: 99;
  background-color: var(--bg-base);
}

.switch-other-popover.show {
  width: 300px;
  height: 300px;
  visibility: visible;
  opacity: 1;
}

.switch-other-drawer {
  position: fixed;
  bottom: 0px;
  left: 8px;
  right: 8px;
  height: 350px;
  transform: translateY(100%);
  border-radius: 22px;
  border: 2px solid #3f3f46;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  background-color: var(--bg-base);
}

.switch-other-drawer.show {
  transform: translateY(0);
  bottom: 5px;
}

.switch-other-span {
  font-size: 14px;
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

.menu-full-mask.show .page-btn-mobile {
  opacity: 1;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.perch-btn-desktop {
  width: 190px;
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
  padding: 0 48px;
  transition: color 0.3s ease;
  cursor: pointer;
}

.page-btn-desktop:hover {
  color: var(--text-primary);
}

.page-btn-active {
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

@media (width>=1024px) {
  .header-main {
    box-shadow: none;
  }
}
</style>

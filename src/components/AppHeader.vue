<template>
  <div class="header-main">
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
      <span class="switch-other-span"> Other </span>
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
        v-for="item in navItems"
        :key="item.path"
        class="page-btn-mobile"
        :class="{ 'page-btn-active': route.path === item.path }"
        @click="handleNavClick(item.path)"
      >
        {{ item.name }}
        <span>—</span>
      </button>
    </div>
    <div class="perch-btn-desktop">
      <div v-if="isDesktop" class="button-group">
        <button
          v-for="item in navItems"
          :key="item.path"
          class="page-btn-desktop"
          :class="{ 'page-btn-active': route.path === item.path }"
          @click="router.push(item.path)"
        >
          {{ item.name }}
          <span>—</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
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

const handleNavClick = (path) => {
  // 先关闭菜单
  isMenuOpen.value = false
  // 等待 Vue 完成 DOM 更新后再跳转
  nextTick(() => {
    router.push(path)
  })
}
</script>

<style scoped>
.header-main {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  background-color: var(--bg-base);
}

.switch-other {
  width: 135px;
  height: 44px;
  border-radius: 22px;
  border: 2px solid #46433f;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border 0.2s;
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
  width: 320px;
  height: 320px;
  visibility: visible;
  opacity: 1;
}

.switch-other-drawer {
  position: fixed;
  bottom: 4px;
  left: 8px;
  right: 8px;
  height: 400px;
  transform: translateY(100%);
  border-radius: 22px;
  border: 2px solid #3f3f46;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  background-color: var(--bg-base);
}

.switch-other-drawer.show {
  transform: translateY(0);
}

.switch-other-span {
  font-size: 14px;
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
  transition: opacity 0.4s ease;
  z-index: 100;
  background-color: var(--bg-base);
  box-sizing: border-box;
  overflow-x: hidden;
  opacity: 0;
  pointer-events: none;
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
  position: relative;
  top: 28%;
  left: 0;
  font-size: 24px;
  background: transparent;
  color: var(--text-secondary);
  text-align: right;
  padding-right: 32px;
}

.perch-btn-desktop {
  width: 150px;
  position: fixed;
  top: 32px;
  right: 0;
  display: flex;
  justify-content: flex-start;
  text-align: right;
}
.page-btn-desktop {
  height: 5%;
  height: 40px;
  font-size: 20px;
  background: transparent;
  color: var(--text-secondary);
  text-align: right;
  padding-right: 16px;
}

.page-btn-active {
  color: var(--text-primary);
}

@media (width>=1024px) {
  .switch-other {
    width: 120px;
    height: 42px;
  }
}
</style>

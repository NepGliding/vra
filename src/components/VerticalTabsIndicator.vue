<template>
  <div class="indicator-menu" ref="menuContainer">
    <div class="button-group" ref="buttonGroup">
      <!-- 指示器元素 -->
      <div class="indicator" :style="indicatorStyle"></div>
      <!-- 按钮列表 -->
      <button
        v-for="item in items"
        :key="item.key"
        ref="buttonRefs"
        class="menu-item"
        :class="{ 'menu-item--active': item.key === activeKey }"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

interface MenuItem {
  key: string
  label: string
}

const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    activeKey: string
    indicatorColor?: string
    indicatorWidth?: string
    indicatorRadius?: string
    position?: 'left' | 'right'
    offset?: string
  }>(),
  {
    indicatorColor: 'var(--bg-hover)',
    indicatorWidth: '4px',
    indicatorRadius: '2px',
    position: 'right',
    offset: '16px',
  },
)

const emit = defineEmits<{
  (e: 'click', item: MenuItem): void
}>()

// 按钮 DOM 引用集合
const buttonRefs = ref<HTMLButtonElement[]>([])
const buttonGroup = ref<HTMLElement | null>(null)
const menuContainer = ref<HTMLElement | null>(null)

// 计算当前激活按钮的索引
const activeIndex = computed(() => props.items.findIndex((item) => item.key === props.activeKey))

// 指示器样式计算
const indicatorStyle = computed(() => {
  const idx = activeIndex.value
  if (idx === -1 || !buttonRefs.value[idx]) return {}

  const btn = buttonRefs.value[idx]
  const groupRect = buttonGroup.value?.getBoundingClientRect()
  if (!groupRect) return {}

  const btnRect = btn.getBoundingClientRect()
  // 计算相对于 .button-group 的位置
  const top = btnRect.top - groupRect.top + (btnRect.height - indicatorHeight) / 2

  return {
    top: `${top}px`,
    [props.position]: props.offset,
    width: props.indicatorWidth,
    height: `${indicatorHeight}px`,
    backgroundColor: props.indicatorColor,
    borderRadius: props.indicatorRadius,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
})

// 指示器高度（可调整或由用户传入，这里固定为 18px，也可以提取为 prop）
const indicatorHeight = 18

// 处理点击
const handleClick = (item: MenuItem) => {
  emit('click', item)
}

// 重新计算指示器（当窗口尺寸变化或内容变化时）
const updateIndicator = () => {
  // 强制重新计算 computed 的依赖触发更新
  // 因为 indicatorStyle 依赖 buttonRefs 的尺寸，而 ref 变化会触发重新计算
  // 但我们还需确保 buttonRefs 已填充
  nextTick(() => {
    // 无额外操作，computed 会自动重新求值
  })
}

// 使用 ResizeObserver 监听容器尺寸变化
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (window.ResizeObserver && menuContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      updateIndicator()
    })
    resizeObserver.observe(menuContainer.value)
  }

  // 窗口变化时也更新
  window.addEventListener('resize', updateIndicator)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateIndicator)
})

// 当 activeKey 变化时，确保指示器位置更新（比如路由变化后）
watch(() => props.activeKey, updateIndicator)

// 初始挂载后计算一次
onMounted(() => {
  nextTick(updateIndicator)
})
</script>

<style scoped>
.indicator-menu {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.button-group {
  position: relative;
  width: 100%;
}

.indicator {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.menu-item {
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0 48px; /* 可根据需要调整 */
  height: 45px;
  font-size: 20px;
  font-weight: bold;
  color: var(--text-secondary);
  text-align: right;
  cursor: pointer;
  transition: color 0.3s ease;
}

.menu-item:hover {
  color: var(--text-primary);
}

.menu-item--active {
  color: var(--text-primary);
}
</style>

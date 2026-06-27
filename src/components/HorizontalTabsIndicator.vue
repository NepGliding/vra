<template>
  <div class="tabs-indicator-wrapper" ref="wrapperRef">
    <div class="tabs-scroll" ref="scrollRef">
      <div class="tabs-container">
        <!-- 指示器横条 -->
        <div class="indicator-bar" :style="indicatorStyle"></div>
        <!-- 每一个 Tab 项 -->
        <button
          v-for="item in items"
          :key="item.key"
          ref="tabRefs"
          class="tab-item"
          :class="{ 'tab-item--active': item.key === activeKey }"
          @click="handleClick(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  activeKey: {
    type: String,
    required: true,
  },
  indicatorColor: {
    type: String,
    default: 'var(--el-active)',
  },
  indicatorHeight: {
    type: String,
    default: '3px',
  },
  indicatorRadius: {
    type: String,
    default: '2px',
  },
  // 新增：自定义宽度（可选）
  indicatorWidth: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['click'])

// DOM 引用
const tabRefs = ref([])
const scrollRef = ref(null)
const wrapperRef = ref(null)

// 当前激活项的索引
const activeIndex = computed(() => {
  return props.items.findIndex((item) => item.key === props.activeKey)
})

// 指示器样式（水平底部横条）
const indicatorStyle = computed(() => {
  const idx = activeIndex.value
  if (idx === -1 || !tabRefs.value[idx]) return { display: 'none' }

  const btn = tabRefs.value[idx]
  const container = scrollRef.value
  if (!container) return { display: 'none' }

  const containerRect = container.getBoundingClientRect()
  const btnRect = btn.getBoundingClientRect()

  // 计算基础 left（Tab 左边缘相对容器的位置）
  let left = btnRect.left - containerRect.left + container.scrollLeft

  // 确定指示器宽度：优先自定义，否则使用 Tab 宽度
  let width
  if (props.indicatorWidth) {
    width = props.indicatorWidth
  } else {
    width = `${btnRect.width}px`
  }

  // 将宽度转为数值（单位 px），用于计算居中偏移
  const widthNum = parseFloat(width)
  const btnWidth = btnRect.width
  // 如果指示器宽度小于 Tab 宽度，则居中对齐
  if (widthNum < btnWidth) {
    const offset = (btnWidth - widthNum) / 2
    left += offset
  }

  return {
    left: `${left}px`,
    width: width,
    height: props.indicatorHeight,
    backgroundColor: props.indicatorColor,
    borderRadius: props.indicatorRadius,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
})

// 点击处理
const handleClick = (item) => {
  emit('click', item)
}

// 强制更新指示器位置
const updateIndicator = () => {
  nextTick(() => {
    // computed 会自动更新
  })
}

let resizeObserver = null
let scrollObserver = null

onMounted(() => {
  if (window.ResizeObserver && wrapperRef.value) {
    resizeObserver = new ResizeObserver(updateIndicator)
    resizeObserver.observe(wrapperRef.value)
  }
  window.addEventListener('resize', updateIndicator)

  if (scrollRef.value) {
    scrollRef.value.addEventListener('scroll', updateIndicator)
    if (window.ResizeObserver) {
      scrollObserver = new ResizeObserver(updateIndicator)
      scrollObserver.observe(scrollRef.value)
    }
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
  if (scrollObserver) scrollObserver.disconnect()
  window.removeEventListener('resize', updateIndicator)
  if (scrollRef.value) {
    scrollRef.value.removeEventListener('scroll', updateIndicator)
  }
})

watch(() => props.activeKey, updateIndicator)

onMounted(() => {
  nextTick(updateIndicator)
})
</script>

<style scoped>
.tabs-indicator-wrapper {
  width: 100%;
  position: relative;
}

.tabs-scroll {
  overflow-x: auto;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.tabs-container {
  display: inline-flex;
  position: relative;
  white-space: nowrap;
  padding: 0 4px;
}

.indicator-bar {
  position: absolute;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.tab-item {
  flex-shrink: 0;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
  outline: none;
  position: relative;
  z-index: 2;
}

.tab-item:hover {
  color: var(--text-primary);
}

.tab-item--active {
  color: var(--text-primary);
  font-weight: 600;
}

@media (width<=1024px) {
  .tab-item {
    padding: 12px;
  }
}
</style>

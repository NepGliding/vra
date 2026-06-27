<template>
  <div class="res-main">
    <div class="res-content">
      <!-- 顶部横向 Tab（分类导航）- 仅用于导航滚动 -->
      <div class="tabs-wrapper" v-if="groupedTools.length">
        <HorizontalTabsIndicator
          :items="tabItems"
          :active-key="activeCategory"
          indicator-color="var(--el-active)"
          indicator-height="4px"
          indicator-width="40px"
          @click="scrollToCategory"
        />
      </div>

      <!-- 连续展示所有分类的工具（不进行筛选分离） -->
      <div v-if="!loading && groupedTools.length">
        <div
          v-for="group in groupedTools"
          :key="group.category"
          class="category-section"
          :data-category="group.category"
        >
          <!-- 分类标题 -->
          <h2 class="category-title">{{ group.category }}</h2>

          <!-- 卡片网格布局 -->
          <div class="card-container">
            <div
              v-for="tool in group.items"
              :key="tool.title"
              class="tool-card"
              @click="goToOfficial(tool.officialUrl)"
            >
              <!-- 卡片头部：图标 + 工具名称 -->
              <div class="card-header">
                <img :src="tool.logo" :alt="tool.title" class="card-logo" />
                <a
                  :href="formatUrl(tool.officialUrl)"
                  target="_blank"
                  class="title-link"
                  @click.stop
                >
                  {{ tool.title }}
                </a>
              </div>

              <!-- 卡片主体：描述 -->
              <div class="card-body">
                <p class="card-desc">{{ tool.desc }}</p>
              </div>

              <!-- 卡片底部：网盘下载 -->
              <div class="card-footer" v-if="tool.netDiskUrl !== 'false'">
                <span class="file-size">{{ tool.fileSize }}</span>
                <a :href="formatUrl(tool.netDiskUrl)" target="_blank" class="disk-btn" @click.stop>
                  网盘下载
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch, onBeforeUnmount } from 'vue'
import { useFetch, useThrottleFn, useEventListener, useWindowScroll } from '@vueuse/core'
import HorizontalTabsIndicator from '@/components/HorizontalTabsIndicator.vue'

// 数据获取
const { data: toolList, isFetching: loading } = useFetch('/vra/resource/data.json').json()

// 分组数据
const groupedTools = computed(() => {
  const groupsMap = new Map()
  for (const tool of toolList.value || []) {
    const cat = tool.category || '其他工具'
    if (!groupsMap.has(cat)) groupsMap.set(cat, { category: cat, items: [] })
    groupsMap.get(cat).items.push(tool)
  }
  return Array.from(groupsMap.values())
})

// 计算 tabItems（用于组件）
const tabItems = computed(() => {
  return groupedTools.value.map((group) => ({
    key: group.category,
    label: group.category,
  }))
})

const { y } = useWindowScroll()
const activeCategory = ref('')
const isScrolling = ref(false) // 滚动动画锁定标志

// 更新高亮分类（滚动过程中跳过）
const updateActiveCategory = () => {
  if (isScrolling.value) return // 关键：滚动期间不更新
  const sections = document.querySelectorAll('.category-section')
  if (!sections.length) return

  const viewportTop = y.value + 80
  let currentSection = null
  let minDistance = Infinity

  for (const section of sections) {
    const rect = section.getBoundingClientRect()
    const sectionTop = rect.top + y.value
    const distance = Math.abs(sectionTop - viewportTop)
    if (distance < minDistance) {
      minDistance = distance
      currentSection = section
    }
  }

  if (currentSection) {
    const category = currentSection.getAttribute('data-category')
    if (category && activeCategory.value !== category) {
      activeCategory.value = category
    }
  }
}

const throttledUpdate = useThrottleFn(updateActiveCategory, 100)

// ---------- 滚动结束处理（scrollend 事件） ----------
let scrollEndHandler = null
let fallbackTimer = null

// 滚动结束后的回调（解锁并校正）
const onScrollEnd = () => {
  // 移除监听器（once 方式会自动移除，但为了安全也手动清理）
  window.removeEventListener('scrollend', scrollEndHandler)
  clearTimeout(fallbackTimer)
  isScrolling.value = false
  updateActiveCategory() // 校正高亮
}

// 滚动到指定分类（点击 Tab 触发）
const scrollToCategory = (item) => {
  const category = item.key
  const targetSection = document.querySelector(`.category-section[data-category="${category}"]`)
  if (!targetSection) return

  // 1. 立即高亮点击的分类（指示器立刻跳转）
  activeCategory.value = category

  // 2. 锁定滚动更新
  isScrolling.value = true

  // 3. 执行平滑滚动
  const offsetTop = targetSection.getBoundingClientRect().top + y.value - 72
  window.scrollTo({ top: offsetTop, behavior: 'smooth' })

  // 4. 清除之前的监听和定时器（防止重叠）
  window.removeEventListener('scrollend', scrollEndHandler)
  clearTimeout(fallbackTimer)

  // 5. 使用 scrollend 事件（现代浏览器）
  if ('onscrollend' in window) {
    scrollEndHandler = onScrollEnd
    window.addEventListener('scrollend', scrollEndHandler, { once: true })
  }

  // 6. 降级方案：如果 scrollend 未触发（例如某些浏览器或用户快速中断），用定时器兜底
  fallbackTimer = setTimeout(() => {
    // 如果仍然在滚动状态，强制结束
    if (isScrolling.value) {
      window.removeEventListener('scrollend', scrollEndHandler)
      isScrolling.value = false
      updateActiveCategory()
    }
  }, 800) // 平滑滚动一般 500~800ms，可根据实际情况调整
}

// ---------- 组件生命周期 ----------
// 清理所有监听和定时器
onBeforeUnmount(() => {
  window.removeEventListener('scrollend', scrollEndHandler)
  clearTimeout(fallbackTimer)
  // 如果有使用 useEventListener 的 scroll 监听，它会自动清理（useEventListener 自动管理）
})

// 数据加载完成后初始化高亮
watch(
  groupedTools,
  async (newGroups) => {
    if (newGroups.length && !loading.value) {
      await nextTick()
      activeCategory.value = newGroups[0].category
      updateActiveCategory()
    }
  },
  { immediate: true },
)

// 窗口变化时更新（但不要干扰滚动动画）
useEventListener('resize', () => {
  if (!isScrolling.value) updateActiveCategory()
})

// 滚动事件监听（使用 useEventListener 自动绑定/卸载）
useEventListener('scroll', throttledUpdate)

// 辅助方法
const formatUrl = (url) => {
  if (!url) return '#'
  return url.startsWith('http') ? url : `https://${url}`
}

const goToOfficial = (url) => {
  const formatted = formatUrl(url)
  if (formatted !== '#') window.open(formatted, '_blank')
}
</script>

<style scoped>
.res-main {
  width: 100%;
  min-height: 100vh;
}
.res-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 分类Tab导航样式 */
.tabs-wrapper {
  position: sticky;
  top: 64px;
  background: var(--bg-base);
  z-index: 99;
  padding: 4px 0;
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.06));
}

/* 分类区块样式 */
.category-section {
  margin-top: 16px;
  margin-bottom: 48px;
  scroll-margin-top: 80px; /* 滚动定位时的偏移量，避免被导航栏遮挡 */
}

.category-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 4px solid var(--el-active);
  color: var(--text-primary);
}

/* 卡片容器 - 网格布局核心样式 */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 8px;
}

/* 工具卡片样式 */
.tool-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
}
.tool-card:hover {
  background: var(--BLACK_WHITE);
}

/* 卡片头部：图标+名称 */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}
.card-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 0;
  padding: 4px;
  flex-shrink: 0;
}
.title-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;
  transition: color 0.2s;
}
.title-link:hover {
  color: var(--bg-hover);
  text-decoration: underline;
}

/* 卡片主体：描述 */
.card-body {
  flex: 1;
}
.card-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 卡片底部：网盘下载 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  margin-top: auto;
}
.file-size {
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
}
.disk-btn {
  display: inline-block;
  padding: 6px 12px;
  color: var(--el-active);
  border-radius: 0;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}
.disk-btn:hover {
  transform: translateY(-1px);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .res-content {
    padding: 16px;
  }
  .category-tabs {
    margin-bottom: 20px;
  }
  .tab-item {
    padding: 6px 14px;
    font-size: 14px;
  }
  .category-title {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  .tool-card {
    padding: 14px;
  }
  .card-logo {
    width: 40px;
    height: 40px;
  }
  .title-link {
    font-size: 15px;
  }
  .disk-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
  .category-section {
    margin-bottom: 32px;
  }
}
</style>

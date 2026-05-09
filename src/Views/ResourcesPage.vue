<template>
  <div class="res-main">
    <div class="res-content">
      <!-- 顶部横向 Tab（分类导航）- 仅用于导航滚动 -->
      <div class="category-tabs" v-if="groupedTools.length">
        <div
          v-for="group in groupedTools"
          :key="group.category"
          class="tab-item"
          :class="{ active: activeCategory === group.category }"
          @click="scrollToCategory(group.category)"
        >
          {{ group.category }}
        </div>
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

      <!-- 空状态/加载状态 -->
      <div v-else-if="!loading && !groupedTools.length" class="empty-state">暂无工具资源</div>
      <div v-if="loading" class="loading-state">加载工具列表中...</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch } from 'vue'
import { useFetch, useThrottleFn, useEventListener, useWindowScroll } from '@vueuse/core'

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

// 当前高亮的分类
const activeCategory = ref('')

// 获取窗口滚动位置
const { y } = useWindowScroll()

// 节流更新高亮分类
const updateActiveCategory = () => {
  const sections = document.querySelectorAll('.category-section')
  if (!sections.length) return

  const viewportTop = y.value + 80 // 偏移量（导航栏高度）
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

// 监听滚动与窗口尺寸变化（自动绑定/卸载）
useEventListener('scroll', throttledUpdate)
useEventListener('resize', throttledUpdate)

// 滚动到指定分类
const scrollToCategory = (category) => {
  const targetSection = document.querySelector(`.category-section[data-category="${category}"]`)
  if (targetSection) {
    const offsetTop = targetSection.getBoundingClientRect().top + y.value - 72
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    activeCategory.value = category
  }
}

// 辅助方法
const formatUrl = (url) => {
  if (!url) return '#'
  return url.startsWith('http') ? url : `https://${url}`
}

const goToOfficial = (url) => {
  const formatted = formatUrl(url)
  if (formatted !== '#') window.open(formatted, '_blank')
}

// 数据加载完成后初始化高亮
watch(
  groupedTools,
  async (newGroups) => {
    if (newGroups.length && !loading.value) {
      await nextTick()
      activeCategory.value = newGroups[0].category
      updateActiveCategory() // 立即校正高亮
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.res-main {
  width: 100%;
  min-height: 100vh;
}
.res-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 36px 24px;
}

/* 分类Tab导航样式 */
.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: thin;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  position: fixed;
  top: 64px;
  background-color: transparent;
  backdrop-filter: blur(12px);
  z-index: 99;
}
.tab-item {
  flex-shrink: 0;
  padding: 8px 20px;
  border-radius: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
}
.tab-item.active {
  color: var(--el-active);
  background: var(--bg-surface);
  border-color: var(--el-active);
}

/* 分类区块样式 */
.category-section {
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
  background: var(--bg-surface);
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

/* 空状态/加载状态样式 */
.empty-state,
.loading-state {
  text-align: center;
  padding: 80px 20px;
  font-size: 15px;
  color: var(--text-secondary);
  background: var(--bg-surface);
  border-radius: 0;
  margin-top: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
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

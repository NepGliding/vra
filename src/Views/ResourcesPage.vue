<template>
  <div class="res-main">
    <div class="res-content">
      <!-- 顶部横向 Tab（分类导航）- 保留原有逻辑 -->
      <div class="category-tabs" v-if="groupedTools.length">
        <div
          v-for="group in groupedTools"
          :key="group.category"
          class="tab-item"
          :class="{ active: selectedCategory === group.category }"
          @click="selectedCategory = group.category"
        >
          {{ group.category }}
        </div>
      </div>

      <!-- 卡片网格布局 - 替换原表格布局 -->
      <div class="card-container" v-if="currentCategoryTools.length">
        <div
          v-for="tool in currentCategoryTools"
          :key="tool.title"
          class="tool-card"
          @click="goToOfficial(tool.officialUrl)"
        >
          <!-- 卡片头部：图标 + 工具名称 -->
          <div class="card-header">
            <img :src="tool.logo" :alt="tool.title" class="card-logo" />
            <a :href="formatUrl(tool.officialUrl)" target="_blank" class="title-link" @click.stop>
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

      <!-- 空状态/加载状态 - 保留原有逻辑，仅调整样式类名适配 -->
      <div v-else-if="!loading && groupedTools.length" class="empty-state">该分类下暂无工具</div>
      <div v-if="loading" class="loading-state">加载工具列表中...</div>
      <div v-else-if="toolList.length === 0" class="empty-state">暂无工具数据</div>
    </div>
  </div>
</template>

<script setup>
// 所有脚本逻辑完全保留，无任何修改
import { ref, computed, watch, onMounted } from 'vue'

const toolList = ref([])
const loading = ref(true)

// 分组（按 category）
const groupedTools = computed(() => {
  const groupsMap = new Map()
  for (const tool of toolList.value) {
    const cat = tool.category || '其他工具'
    if (!groupsMap.has(cat)) {
      groupsMap.set(cat, { category: cat, items: [] })
    }
    groupsMap.get(cat).items.push(tool)
  }
  return Array.from(groupsMap.values())
})

// 当前选中的分类
const selectedCategory = ref('')

// 当前分类下的工具列表
const currentCategoryTools = computed(() => {
  const group = groupedTools.value.find((g) => g.category === selectedCategory.value)
  return group?.items || []
})

// 默认选中第一个分类
watch(
  groupedTools,
  (newGroups) => {
    if (newGroups.length && !selectedCategory.value) {
      selectedCategory.value = newGroups[0].category
    }
  },
  { immediate: true },
)

// 通用方法
const formatUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

// 整行/整卡片点击跳转官网
const goToOfficial = (url) => {
  const formattedUrl = formatUrl(url)
  if (formattedUrl !== '#') {
    window.open(formattedUrl, '_blank')
  }
}

// 加载 JSON 数据
const loadToolData = async () => {
  loading.value = true
  try {
    const response = await fetch('/vra/resource/data.json')
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const data = await response.json()
    toolList.value = data
  } catch (error) {
    console.error('加载工具数据失败：', error)
    toolList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadToolData()
})
</script>

<style scoped>
.res-main {
  width: 100%;
  min-height: 100vh;
}
.res-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 24px;
}

/* 分类Tab样式 - 保留原有样式 */
.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: thin;
  padding-bottom: 12px;
  margin-bottom: 28px;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.tab-item {
  flex-shrink: 0;
  padding: 8px 20px;
  border-radius: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  transition: all 0.2s;
  cursor: pointer;
}
.tab-item.active {
  color: var(--el-active);
  background: var(--bg-surface);
  border-color: var(--el-active);
}

/* 卡片容器 - 网格布局核心样式 */
.card-container {
  display: grid;
  /* 响应式列数：最小280px一列，自动填充，列间距20px */
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
  height: 100%; /* 保证同行列高一致 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--el-active);
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
  flex-shrink: 0; /* 防止图标压缩 */
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
  flex: 1; /* 让描述区域填充中间空间，底部元素靠下 */
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
  margin-top: auto; /* 固定在卡片底部 */
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

/* 空状态/加载状态样式 - 适配卡片布局 */
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
  grid-column: 1 / -1; /* 跨所有列显示 */
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
}
</style>

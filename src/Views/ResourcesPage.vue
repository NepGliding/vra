<template>
  <div class="res-main">
    <div class="res-content">
      <!-- 顶部横向 Tab（分类导航），桌面端和移动端共用 -->
      <div class="category-tabs" v-if="groupedTools.length">
        <div
          v-for="group in groupedTools"
          :key="group.category"
          class="tab-item"
          :class="{ active: selectedCategory === group.category }"
          @click="selectedCategory = group.category"
        >
          {{ group.category }}
          <span class="tab-count">{{ group.items.length }}</span>
        </div>
      </div>

      <!-- 卡片网格：根据屏幕宽度自适应列数 -->
      <div class="cards-grid" v-if="currentCategoryTools.length">
        <div v-for="tool in currentCategoryTools" :key="tool.title" class="tool-card">
          <div class="card-header">
            <img :src="tool.logo" :alt="tool.title" class="card-logo" />
            <div class="card-title-wrap">
              <h3 class="card-title">{{ tool.title }}</h3>
              <span class="file-size">{{ tool.fileSize }}</span>
            </div>
          </div>
          <p class="card-desc">{{ tool.desc }}</p>
          <div class="card-actions">
            <a :href="formatUrl(tool.officialUrl)" target="_blank" class="action-link official"
              >官网</a
            >
            <a :href="formatUrl(tool.netDiskUrl)" target="_blank" class="action-link disk">网盘</a>
          </div>
        </div>
      </div>
      <div v-else-if="!loading && groupedTools.length" class="empty-tools">该分类下暂无工具</div>

      <!-- 加载 / 空状态 -->
      <div v-if="loading" class="loading-state">加载工具列表中...</div>
      <div v-else-if="toolList.length === 0" class="empty-state">暂无工具数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// ---------- 工具数据 ----------
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

// ---------- 通用方法 ----------
const formatUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

// 加载 JSON 数据（请根据实际部署路径修改）
const loadToolData = async () => {
  loading.value = true
  try {
    // 👇 改成你的 data.json 实际路径
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
/* ---------- 基础样式 ---------- */
.res-main {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fc;
}
.res-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 24px;
}

/* ---------- 横向 Tab 分类栏（共用） ---------- */
.category-tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: thin;
  padding-bottom: 12px;
  margin-bottom: 28px;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid #e9edf2;
}
.tab-item {
  flex-shrink: 0;
  padding: 8px 20px;
  background: transparent;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 500;
  color: #4a5b7a;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
}
.tab-item.active {
  color: #2c5f8a;
  background: #ecf5fb;
}
.tab-count {
  margin-left: 8px;
  font-size: 0.75rem;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 30px;
  color: #2d3a4e;
}
.tab-item.active .tab-count {
  background: #cbdff0;
  color: #1e3a5f;
}

/* ---------- 卡片网格（响应式列数） ---------- */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* 卡片样式（统一适用于移动端和桌面端） */
.tool-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
  border: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
}
.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #dce5ef;
}

.card-header {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 14px;
}
.card-logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 16px;
  background: #f8fafd;
  padding: 6px;
  border: 1px solid #eef2f6;
}
.card-title-wrap {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #1f2a44;
}
.file-size {
  font-size: 0.7rem;
  background: #eef2ff;
  padding: 4px 10px;
  border-radius: 30px;
  color: #2c5f8a;
  white-space: nowrap;
}
.card-desc {
  font-size: 0.85rem;
  line-height: 1.45;
  color: #4a5b7a;
  margin: 8px 0 16px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}
.card-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-end;
  margin-top: 8px;
}
.action-link {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 40px;
  text-decoration: none;
  transition: all 0.2s;
}
.action-link.official {
  background: #ecfdf3;
  color: #067647;
  border: 1px solid #abefc6;
}
.action-link.official:hover {
  background: #d1fadf;
  transform: translateY(-1px);
}
.action-link.disk {
  background: #eff8ff;
  color: #175cd3;
  border: 1px solid #b2ddff;
}
.action-link.disk:hover {
  background: #e1effe;
  transform: translateY(-1px);
}

/* 空状态提示 */
.empty-tools,
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 1rem;
  color: #6c7a91;
  background: white;
  border-radius: 28px;
  margin-top: 40px;
}

/* 移动端微调：减少内边距，稍微缩小最小卡片宽度 */
@media (max-width: 640px) {
  .res-content {
    padding: 16px;
  }
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .category-tabs {
    margin-bottom: 20px;
  }
  .tab-item {
    padding: 6px 16px;
    font-size: 0.9rem;
  }
}

/* 中等屏幕（平板）显示两列 */
@media (min-width: 641px) and (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

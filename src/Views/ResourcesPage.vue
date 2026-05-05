<template>
  <div class="res-main">
    <div class="res-content">
      <!-- ========= 移动端布局：横向滚动分类 + 当前分类卡片列表 ========= -->
      <div v-if="!isDesktop" class="mobile-layout">
        <!-- 横向 Tab 栏（可左右滑动） -->
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

        <!-- 当前分类下的工具卡片列表 -->
        <div v-if="currentCategoryTools.length" class="cards-area">
          <div class="category-info">
            <h2>{{ selectedCategory }}</h2>
            <span class="count">{{ currentCategoryTools.length }} 个工具</span>
          </div>
          <div class="cards-list">
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
                <a :href="formatUrl(tool.netDiskUrl)" target="_blank" class="action-link disk"
                  >网盘</a
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="!loading && groupedTools.length" class="empty-tools">该分类下暂无工具</div>
      </div>

      <!-- ========= 桌面端布局：多表格并排 + 右侧浮动目录 ========= -->
      <div v-else class="desktop-layout">
        <div
          v-for="group in groupedTools"
          :key="group.category"
          class="desktop-table-wrapper"
          :id="getTableId(group.category)"
        >
          <div class="table-header">
            <h2>{{ group.category }}</h2>
          </div>
          <table class="tool-table">
            <thead>
              <tr>
                <th>图标</th>
                <th>工具名称</th>
                <th>描述</th>
                <th>大小</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tool in group.items" :key="tool.title">
                <td>
                  <img :src="tool.logo" :alt="tool.title" class="tool-logo" />
                </td>
                <td class="tool-title">{{ tool.title }}</td>
                <td class="tool-desc">{{ tool.desc }}</td>
                <td class="tool-size">{{ tool.fileSize }}</td>
                <td>
                  <div class="tool-actions">
                    <a :href="formatUrl(tool.officialUrl)" target="_blank" class="tool-link"
                      >官网</a
                    >
                    <a :href="formatUrl(tool.netDiskUrl)" target="_blank" class="tool-link">网盘</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 浮动目录：仅桌面端且分类数量 >= 1 时显示 -->
      <div v-if="isDesktop && groupedTools.length >= 1 && !loading" class="floating-toc">
        <div class="toc-title">📑 分类跳转</div>
        <div
          v-for="group in groupedTools"
          :key="group.category"
          class="toc-item"
          :class="{ active: activeDesktopCategory === group.category }"
          @click="scrollToTable(group.category)"
        >
          {{ group.category }}
          <span class="toc-count">{{ group.items.length }}</span>
        </div>
      </div>

      <!-- 加载 / 空状态 -->
      <div v-if="loading" class="loading-state">加载工具列表中...</div>
      <div v-else-if="toolList.length === 0" class="empty-state">暂无工具数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useBreakpoints } from '@vueuse/core'

// ---------- 响应式断点 (桌面 ≥1024px) ----------
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
const isDesktop = screens.greaterOrEqual('desktop')

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

// ---------- 移动端专用：当前选中的分类 & 对应的工具列表 ----------
const selectedCategory = ref('')
const currentCategoryTools = computed(() => {
  const group = groupedTools.value.find((g) => g.category === selectedCategory.value)
  return group?.items || []
})

// 当分组数据加载完成后，默认选中第一个分类
watch(
  groupedTools,
  (newGroups) => {
    if (newGroups.length && !selectedCategory.value) {
      selectedCategory.value = newGroups[0].category
    }
  },
  { immediate: true },
)

// ---------- 桌面端专用：滚动高亮当前分类 & 平滑跳转 ----------
const activeDesktopCategory = ref('')
let scrollListener = null

// 生成合法的 DOM ID（去除空格和特殊字符）
const getTableId = (category) => {
  return `table-${category.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u4e00-\u9fa5-]/g, '')}`
}

// 滚动到指定分类的表格
const scrollToTable = (category) => {
  const element = document.getElementById(getTableId(category))
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // 手动设置一次高亮，滚动结束后滚动监听也会自动修正
    activeDesktopCategory.value = category
  }
}

// 监听窗口滚动，更新高亮的分类（找出最靠近视口顶部的表格）
const updateActiveCategoryOnScroll = () => {
  if (!isDesktop.value || groupedTools.value.length === 0) return
  const wrappers = groupedTools.value
    .map((group) => ({
      category: group.category,
      element: document.getElementById(getTableId(group.category)),
    }))
    .filter((item) => item.element)

  if (wrappers.length === 0) return

  // 找到第一个距离视口顶部 >= 0 的表格，如果全部在视口上方，则取最后一个
  let active = wrappers[0].category
  let minPositiveTop = Infinity

  for (const wrapper of wrappers) {
    const rect = wrapper.element.getBoundingClientRect()
    const top = rect.top
    if (top >= 0 && top < minPositiveTop) {
      minPositiveTop = top
      active = wrapper.category
    } else if (top < 0 && wrapper === wrappers[wrappers.length - 1]) {
      // 如果所有表格都已滚动到上方，高亮最后一个分类
      active = wrapper.category
    }
  }
  activeDesktopCategory.value = active
}

// 监听滚动事件（节流）
const onWindowScroll = () => {
  requestAnimationFrame(updateActiveCategoryOnScroll)
}

onMounted(() => {
  loadToolData()
  if (isDesktop.value) {
    window.addEventListener('scroll', onWindowScroll)
    // 初次挂载后执行一次，确保高亮正确
    setTimeout(updateActiveCategoryOnScroll, 100)
  }
})

onUnmounted(() => {
  if (scrollListener) {
    window.removeEventListener('scroll', onWindowScroll)
  }
})

// ---------- 通用方法 ----------
// 补全 URL 协议
const formatUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

// 加载 JSON 数据（请根据实际部署路径修改）
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
</script>

<style scoped>
/* ---------- 基础样式 ---------- */
.res-main {
  width: 100%;
  min-height: 100vh;
  /* background-color: #f8f9fc; */
}
.res-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
  position: relative;
}

/* ---------- 移动端：横向 Tab + 卡片 ---------- */
.mobile-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: thin;
  padding-bottom: 8px;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.tab-item {
  flex-shrink: 0;
  padding: 8px 16px;
  background: #f0f2f5;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #3b4a62;
  transition: all 0.2s;
  cursor: pointer;
}
.tab-item.active {
  background: #2c5f8a;
  color: white;
  box-shadow: 0 2px 8px rgba(44, 95, 138, 0.25);
}
.tab-count {
  margin-left: 6px;
  font-size: 0.7rem;
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 20px;
}
.tab-item.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
}
.category-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 8px 0 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid #eef2f6;
}
.category-info h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #2c3e66, #1a2a44);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
.count {
  font-size: 0.8rem;
  color: #6c7a91;
  background: #eef2f6;
  padding: 4px 10px;
  border-radius: 20px;
}
.cards-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
/* 卡片样式（复用原风格） */
.tool-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
  border: 1px solid #edf2f7;
}
.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #dce5ef;
}
.card-header {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 12px;
}
.card-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 14px;
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
  font-size: 0.75rem;
  background: #eef2ff;
  padding: 4px 8px;
  border-radius: 20px;
  color: #2c5f8a;
}
.card-desc {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #4a5b7a;
  margin: 12px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 8px;
}
.action-link {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 30px;
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
.empty-tools {
  text-align: center;
  padding: 40px;
  color: #8f9bb2;
  background: white;
  border-radius: 28px;
  margin-top: 20px;
}

/* ---------- 桌面端：多表格并排 ---------- */
.desktop-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 32px;
  align-items: start;
}
.desktop-table-wrapper {
  background: white;
  border-radius: 24px;
  padding: 8px 0 16px 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}
.table-header {
  padding: 16px 20px 8px 20px;
}
.table-header h2 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #1e2f50, #2c5282);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;
  border-left: 4px solid #3b82f6;
  padding-left: 12px;
}
.tool-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.tool-table th,
.tool-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid #eef2f6;
  vertical-align: middle;
}
.tool-table th {
  background-color: #f8fafd;
  font-weight: 600;
  color: #1e2f50;
  font-size: 0.85rem;
}
.tool-logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
  border-radius: 10px;
  background: #f9fafb;
  padding: 4px;
}
.tool-title {
  font-weight: 600;
  color: #1f2a44;
}
.tool-desc {
  max-width: 260px;
  color: #4a5b7a;
  font-size: 0.8rem;
  line-height: 1.3;
}
.tool-size {
  font-family: monospace;
  font-size: 0.8rem;
  color: #2c6e9e;
  white-space: nowrap;
}
.tool-actions {
  display: flex;
  gap: 12px;
}
.tool-link {
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f0f4f9;
  color: #2c5f8a;
  transition: all 0.2s;
}
.tool-link:hover {
  background: #e0e8f2;
  color: #1a4972;
}

/* ---------- 桌面端浮动目录 (TOC) ---------- */
.floating-toc {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  border-radius: 28px;
  padding: 12px 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.15);
  z-index: 1000;
  min-width: 130px;
  max-width: 160px;
  transition: all 0.2s;
}
.toc-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5a7c;
  text-align: center;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  letter-spacing: 0.5px;
}
.toc-item {
  padding: 6px 10px;
  margin: 4px 0;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 24px;
  cursor: pointer;
  color: #334155;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}
.toc-item:hover {
  background: #eef2ff;
  color: #1e40af;
}
.toc-item.active {
  background: #2c5f8a;
  color: white;
  box-shadow: 0 2px 6px rgba(44, 95, 138, 0.2);
}
.toc-count {
  font-size: 0.65rem;
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 6px;
  border-radius: 20px;
  margin-left: 6px;
}
.toc-item.active .toc-count {
  background: rgba(255, 255, 255, 0.2);
}

/* 桌面端屏幕过小时隐藏浮动目录（避免遮挡） */
@media (max-width: 1280px) {
  .floating-toc {
    display: none;
  }
}

/* ---------- 加载/空状态 ---------- */
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

/* 移动端小屏幕微调 */
@media (max-width: 1023px) {
  .res-content {
    padding: 16px;
  }
}
</style>

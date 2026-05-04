<template>
  <div class="res-main">
    <AppNavDesktop v-if="isDesktop" class="nav-desktop" />
    <div class="res-content">
      <!-- 移动端布局：动态生成分类 + 卡片 -->
      <div v-if="!isDesktop" class="div-mobile">
        <div v-for="navItem in navItems" :key="navItem.id" class="category-wrap">
          <span class="category-title">{{ navItem.label }}</span>
          <div class="card-container">
            <ul class="card-list">
              <!-- 遍历当前分类的数据源，渲染卡片 -->
              <li
                v-for="item in resourceData[navItem.id] || []"
                :key="item.title"
                class="card-item"
              >
                <ResourceMobileCard
                  :title="item.title"
                  :logo="item.logo"
                  :description="item.description"
                  :official-url="item['official-url']"
                  :net-disk-url="item['net-disk-url']"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 桌面端布局（暂保留原有结构） -->
      <div v-if="isDesktop" class="div-desktop">
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
          <li>10</li>
          <li>11</li>
          <li>12</li>
          <li>13</li>
          <li>14</li>
          <li>15</li>
          <li>16</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavDesktop from '@/components/AppNavDesktop.vue'
import { useBreakpoints } from '@vueuse/core'
import ResourceMobileCard from '@/components/ResourceMobileCard.vue'

// 存储所有分类的资源数据（key: 分类ID，value: 对应数据列表）
const resourceData = ref({})

// 导航分类配置（复用原有配置）
const navItems = [
  { id: 'hardware', label: '硬件', label_en: 'Hardware' },
  { id: 'software', label: '软件', label_en: 'Software' },
  { id: 'game', label: '游戏', label_en: 'Game' },
  { id: 'website', label: '网站', label_en: 'Website' },
  { id: 'system', label: '系统', label_en: 'System' },
]

// 页面挂载后：遍历所有分类，加载对应JSON数据
onMounted(async () => {
  for (const navItem of navItems) {
    try {
      // 动态拼接数据请求路径：/vra/分类ID/data.json（可根据实际路径调整）
      const res = await fetch(`/vra/resource/${navItem.id}/data.json`)
      resourceData.value[navItem.id] = await res.json()
    } catch (err) {
      console.error(`【${navItem.label}】数据加载失败：`, err)
      // 加载失败时赋值空数组，避免页面报错
      resourceData.value[navItem.id] = []
    }
  }
})

// 响应式断点（复用原有逻辑）
const breakpoints = { mobile: 0, tablet: 768, desktop: 1024 }
const screens = useBreakpoints(breakpoints)
const isDesktop = screens.greaterOrEqual('desktop')
</script>

<style scoped>
.nav-desktop {
  width: 564px;
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}

.res-content {
  /* height: 1024px; */
  margin: 0 auto;
}

/* 移动端样式优化 */
.div-mobile {
  padding: 0 16px;
}

/* 分类容器 */
.category-wrap {
  margin: 16px 0;
}

/* 分类标题 */
.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

/* 卡片容器 */
.card-container {
  height: auto; /* 移除固定高度，自适应卡片数量 */
  padding: 8px;
  border-radius: 8px;
}

/* 卡片列表 */
.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 12px; /* 卡片之间的间距 */
  overflow-x: auto; /* 横向滚动（适配多卡片） */
  height: 242px;
  align-items: center;
}

/* 卡片项 */
.card-item {
  flex-shrink: 0; /* 防止卡片被挤压 */
}

/* 桌面端样式（保留原有） */
.div-desktop ul {
  width: 70%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 150px;
  gap: 1em;
  padding: 0;
  margin: 0 auto;
}
.div-desktop li {
  background-color: rgb(99, 99, 99);
}

@media (width>=1024px) {
  .res-content {
    margin: 60px auto;
  }
}
</style>

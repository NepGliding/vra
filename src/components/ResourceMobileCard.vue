<template>
  <div class="tool-card">
    <div class="tool-card__logo">
      <img :src="tool.logo" :alt="tool.title" />
    </div>
    <div class="tool-card__info">
      <h3 class="tool-card__title">{{ tool.title }}</h3>
      <p class="tool-card__desc">{{ tool.desc }}</p>
      <div class="tool-card__meta">
        <span class="tool-card__size">大小：{{ tool.fileSize }}</span>
        <!-- <div class="tool-card__keywords">
          <span v-for="(kw, idx) in tool.keywords" :key="idx" class="tool-card__keyword">{{
            kw
          }}</span>
        </div> -->
      </div>
    </div>
    <div class="tool-card__actions">
      <!-- 这里用处理后的 URL -->
      <a :href="formatUrl(tool.officialUrl)" target="_blank" class="tool-card__link">官网</a>
      <a :href="formatUrl(tool.netDiskUrl)" target="_blank" class="tool-card__link">网盘</a>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps(['tool'])

// 自动补全 https 的函数
const formatUrl = (url) => {
  if (!url) return '#'
  // 如果已经有 http 或 https 开头，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 否则加上 https://
  return `https://${url}`
}
</script>

<style scoped>
/* 样式不变，和之前一样 */
.tool-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  gap: 20px;
  transition: box-shadow 0.2s ease;
}

.tool-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.tool-card__logo {
  flex: 0 0 64px;
}
.tool-card__logo img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
}

.tool-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tool-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.tool-card__desc {
  margin: 0;
  color: #6b7280;
  line-height: 1.4;
  font-size: 14px;
}

.tool-card__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
}

.tool-card__size {
  font-size: 14px;
  color: #374151;
}

.tool-card__keywords {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-card__keyword {
  padding: 2px 8px;
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 4px;
  font-size: 12px;
}

.tool-card__actions {
  flex: 0 0 120px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.tool-card__link {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.2s;
}

.tool-card__link:hover {
  background: #2563eb;
}
</style>

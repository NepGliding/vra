<template>
  <div class="resource-card">
    <div class="logo-box" @click="handleOfficialJump">
      <img :src="logo" :alt="title" class="logo-img" />
    </div>

    <div class="desc-box">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
      <button class="disk-btn" @click="handleNetDiskJump">网盘下载</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  title: String,
  logo: String,
  description: String,
  officialUrl: String,
  netDiskUrl: String,
})

// 工具函数：自动补全 https 协议（核心修复）
const completeUrl = (url) => {
  if (!url) return ''
  // 如果链接不包含 http/https，自动拼接 https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`
  }
  return url
}

// 跳转官网（自动补全协议）
const handleOfficialJump = () => {
  const url = completeUrl(props.officialUrl)
  if (url) {
    window.open(url, '_blank')
  }
}

// 跳转网盘（自动补全协议）
const handleNetDiskJump = () => {
  const url = completeUrl(props.netDiskUrl)
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
/* 样式完全不变，纯媒体查询 + 无行内样式 */
.resource-card {
  width: 180px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-box {
  width: 130px;
  height: 96px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.logo-img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.desc-box {
  width: 100%;
  padding: 10px;
  text-align: center;
}

.card-title {
  font-size: 16px;
  margin: 0 0 6px;
  color: #333;
}

.card-description {
  width: 84px;
  height: 30px;
  font-size: 12px;
  color: #666;
  margin: 0 0 10px;
  line-height: 1.4;
  text-overflow: ellipsis;
}

.disk-btn {
  padding: 6px 12px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.disk-btn:hover {
  background: #337ecc;
}

/* 移动端媒体查询 */
@media (max-width: 768px) {
  .resource-card {
    width: 96px;
    height: 226px;
    padding: 0;
  }
  .logo-box {
    width: 130px;
    height: 96px;
    flex-shrink: 0;
  }
  .desc-box {
    flex: 1;
    padding: 6px;
  }
  .card-title {
    font-size: 13px;
  }
  .card-description {
    font-size: 11px;
  }
  .disk-btn {
    padding: 4px 8px;
    font-size: 11px;
  }
}
</style>

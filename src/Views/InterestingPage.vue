<template>
  <div class="img-container">
    <img :src="randomImgUrl" alt="随机图片" class="center-img" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imgList = [
  '/vra/interesting/catsb.jpg',
  '/vra/interesting/cathyw.jpg',
  '/vra/interesting/catwen.jpg',
]

const randomIndex = Math.floor(Math.random() * imgList.length)
const randomImgUrl = ref(imgList[randomIndex])
</script>

<style scoped>
.img-container {
  width: 100%;
  min-height: 100vh; /* 最小高度占满视口，内容少也撑满，内容多则自适应 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* 容器内部超出部分隐藏，避免局部滚动 */
  box-sizing: border-box; /* 防止内边距/边框撑大容器 */
}
.center-img {
  max-width: 250px;
  max-height: 250px;
  object-fit: contain;
}
</style>

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
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.center-img {
  max-width: 150px;
  max-height: 150px;
  object-fit: contain;
}
</style>

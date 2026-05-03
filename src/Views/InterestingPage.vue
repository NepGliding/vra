<template>
  <div class="api-main">
    <!-- 新增图片容器，方便精准控制居中与尺寸 -->
    <div class="img-container">
      <img src="/Interesting/catsb.jpg" alt="cat" class="center-img" />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.api-main {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
}

.img-container {
  max-width: 250px;
  max-height: 250px;
  width: 100%;
  height: auto;
}

.center-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 250px;
  max-height: 250px;
}
</style>

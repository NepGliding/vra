import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/styles/global.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 在 mount 之前添加 dark 类
// document.documentElement.classList.add('dark')

app.mount('#app')

import { createRouter, createWebHistory } from 'vue-router'
import ResourcesPage from '@/Views/ResourcesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'resources', component: ResourcesPage },
    { path: '/article', name: 'article', component: () => import('@/Views/ArticlePage.vue') },
    {
      path: '/interesting',
      name: 'interesting',
      component: () => import('@/Views/InterestingPage.vue'),
    },
  ],
  scrollBehavior() {
    // 路由过渡动画持续时间（请与你项目中的 transition 时长保持一致）
    const TRANSITION_DURATION = 360

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ top: 0 })
      }, TRANSITION_DURATION)
    })
  },
})

export default router

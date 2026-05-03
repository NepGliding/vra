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
})

export default router

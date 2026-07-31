import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
    meta: { titleKey: 'home' }
  },
  {
    path: '/games',
    name: 'games',
    component: () => import('@/pages/Games.vue'),
    meta: { titleKey: 'games' }
  },
  {
    path: '/ai',
    name: 'ai',
    component: () => import('@/pages/AIPage.vue'),
    meta: { titleKey: 'ai' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/About.vue'),
    meta: { titleKey: 'about' }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/pages/Notifications.vue'),
    meta: { titleKey: 'notifications' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach((to) => {
  const pageKey = to.meta.titleKey || 'home'
  const lang = localStorage.getItem('hcpgn-lang') || 'zh'
  const titles = {
    zh: { home: '主页 - 盒鸽 HcDove', games: '游戏 - 盒鸽 HcDove', ai: 'AI - 盒鸽 HcDove', about: '关于 - 盒鸽 HcDove', notifications: '通知公告 - 盒鸽 HcDove' },
    en: { home: 'Home - HcDove', games: 'Games - HcDove', ai: 'AI - HcDove', about: 'About - HcDove', notifications: 'Notifications - HcDove' }
  }
  document.title = (titles[lang] && titles[lang][pageKey]) || titles[lang].home
})

export default router

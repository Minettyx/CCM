import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/archive',
    name: 'Archivio',
    component: () => import('../views/Archive.vue')
  },
  {
    path: '/manga/:id',
    name: 'Manga',
    component: () => import('../views/Manga.vue')
  },
  {
    path: '/chapter/:manga/:id',
    name: 'Chapter',
    component: () => import('../views/Chapter.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
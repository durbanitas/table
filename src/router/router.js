import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/table',
    name: 'Table', component: () => import('../views/Table.vue')
  },
  {
    path: '/',
    redirect: '/table'
  },
  {
    path: "/:catchAll(.*)", // unknown path redirect to /table
    redirect: '/table'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/table',
    name: 'Table', component: () => import('../views/TableWrapper.vue')
  },
  {
    path: '/',
    redirect: '/table'
  },
  {
    path: "/:catchAll(.*)", // unknown path redirects to /table
    redirect: '/table'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

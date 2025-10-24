import { createRouter, createWebHistory } from 'vue-router'
import UserManagement from '../components/body.vue'
import DataManagement from '../components/charts.vue'
import CreateUser from '../views/createUser.vue'
import EditUser from '../views/editUser.vue'

const routes = [
  {
    path: '/',
    redirect: '/user-management',
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement,
    meta: { title: '用户管理' },
    children: [
      {
        path: 'create',
        component: CreateUser,
      },
      {
        path: 'edit/:id',
        component: EditUser,
      },
    ],
  },
  {
    path: '/data-management',
    name: 'DataManagement',
    component: DataManagement,
    meta: { title: '数据管理' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫设置页面标题
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router

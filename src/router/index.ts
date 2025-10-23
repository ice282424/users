import { createRouter, createWebHistory } from 'vue-router'
// 导入对应的页面组件
import UserManagement from '../components/body.vue' // 用户管理页
import DataManagement from '../components/charts.vue' // 数据管理页
import CreateUser from '../views/createUser.vue' // 创建用户页面
import EditUser from '../views/editUser.vue' // 编辑用户页面

const routes = [
  {
    path: '/',
    redirect: '/user-management', // 根路径默认跳转到用户管理
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement,
    meta: { title: '用户管理' },
    // 可添加用户管理的子路由
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
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router

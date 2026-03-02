import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { renderSvgIcon } from '@/utils/index'
// 系统设置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    name: 'profile',
    redirect: '/profile/center',
    component: Layout,
    meta: {
      title: '个人中心',
      icon: renderSvgIcon('gerenzhongxin'),
      sort: 4,
    },
    children: [
      {
        path: 'center',
        name: 'center',
        meta: {
          title: '个人中心',
        },
        component: () => import('@/views/profile/index.vue'),
      },
    ],
  },
]

export default routes

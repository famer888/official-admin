import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { SettingOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils/index'
// 系统设置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/payment',
    name: 'payment',
    redirect: '/payment/box',
    component: Layout,
    meta: {
      title: '款项管理',
      icon: renderIcon(SettingOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'box',
        name: 'box',
        meta: {
          title: '款项管理',
        },
        component: () => import('@/views/payment/index.vue'),
      },
    ],
  },
]

export default routes

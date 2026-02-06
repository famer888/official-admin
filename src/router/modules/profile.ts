import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { SettingOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils/index'
// 系统设置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    name: 'profile',
    redirect: '/profile/center',
    component: Layout,
    meta: {
      title: '个人中心',
      icon: renderIcon(SettingOutlined),
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

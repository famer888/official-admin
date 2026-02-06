import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { SettingOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils/index'
// 系统设置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/supermarket',
    name: 'supermarket',
    redirect: '/supermarket/list',
    component: Layout,
    meta: {
      title: '广告超市',
      icon: renderIcon(SettingOutlined),
      sort: 3,
    },
    children: [
      {
        path: 'list',
        name: 'list',
        meta: {
          title: '广告超市',
        },
        component: () => import('@/views/supermarket/index.vue'),
      },
    ],
  },
]

export default routes

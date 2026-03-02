import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { renderSvgIcon } from '@/utils/index'
// 系统设置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/manage',
    name: 'manage',
    redirect: '/manage/panel',
    component: Layout,
    meta: {
      title: '管理中心',
      icon: renderSvgIcon('guanlizhongxin'),
      sort: 1,
    },
    children: [
      {
        path: 'panel',
        name: 'panel',
        meta: {
          title: '管理中心',
        },
        component: () => import('@/views/manage/index.vue'),
      },
    ],
  },
]

export default routes

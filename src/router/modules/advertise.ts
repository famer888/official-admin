import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { renderSvgIcon } from '@/utils/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/advertise',
    name: 'advertise',
    redirect: '/advertise/plan',
    component: Layout,
    meta: {
      title: '广告管理',
      icon: renderSvgIcon('guanggaoguanli'),
      sort: 2.5,
    },
    children: [
      {
        path: 'plan',
        name: 'advertisePlan',
        meta: {
          title: '广告管理',
        },
        component: () => import('@/views/advertise/index.vue'),
      },
    ],
  },
]

export default routes

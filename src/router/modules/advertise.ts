import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'
import { renderSvgIcon } from '@/utils/index'

/**
 * 广告管理模块路由
 * 排序介于「款项管理(2)」与「广告超市(3)」之间
 */
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
      // 广告计划列表页
      {
        path: 'plan',
        name: 'advertisePlan',
        meta: {
          title: '广告管理',
        },
        component: () => import('@/views/advertise/index.vue'),
      },
      // 创建/编辑广告计划（侧栏隐藏）
      {
        path: 'edit',
        name: 'advertiseEdit',
        meta: {
          title: '编辑广告计划',
          hidden: true,
          activeMenu: 'advertisePlan',
        },
        component: () => import('@/views/advertise/edit.vue'),
      },
      // 广告计划详情（只读，侧栏隐藏）
      {
        path: 'detail',
        name: 'advertiseDetail',
        meta: {
          title: '编辑广告计划',
          hidden: true,
          activeMenu: 'advertisePlan',
        },
        component: () => import('@/views/advertise/detail.vue'),
      },
    ],
  },
]

export default routes

import type { AdTypeData } from '../types'

export const adTypesData: AdTypeData[] = [
  {
    id: 'splash',
    title: '开屏广告',
    description: '应用开屏黄金展示位,头部品牌客户青睐样式,填充率、点击率更高。',
    buttonType: 'primary',
    buttonGhost: true,
  },
  {
    id: 'feed',
    title: '信息流广告',
    description: '契合应用原生环境的样式,提供浑然一体的用户体验,助您最大响度获取收益。',
    buttonType: 'primary',
    buttonGhost: false,
  },
  {
    id: 'banner',
    title: 'Banner广告',
    description: '在APP顶/中/底部固定位置广告,展示时间长,高曝光低干扰。',
    buttonType: 'primary',
    buttonGhost: false,
  },
  {
    id: 'interstitial',
    title: '插屏广告',
    description: '在APP功能使用过程中的最佳时机展示,能够同时兼顾高收益和用户体验,为您的产品提供最直观的曝光机会。',
    buttonType: 'primary',
    buttonGhost: true,
  },
  {
    id: 'immersive-feed',
    title: '沉浸式信息流广告',
    description: '竖版视频流全屏播放的视频信息流样式,提供沉浸式无干扰用户体验,转化率更高。',
    buttonType: 'primary',
    buttonGhost: true,
  },
  {
    id: 'nine-grid',
    title: '九宫格广告',
    description: '固定位置展示,广告的曝光机会大大增加。支持批量位置展示及动态图展示,动态化的展示方式牢牢吸引用户眼球刺激点击。',
    buttonType: 'primary',
    buttonGhost: false,
  },
]


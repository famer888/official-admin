/**
 * 广告管理 - 数据接口（Mock）
 * 后续接入真实接口后替换 getAdPlanPage 的实现
 */

/** 计划状态枚举 */
const statusEnum = {
  DRAFT: 0,       // 草稿
  REVIEWING: 1,   // 审核中
  APPROVED: 2,    // 审核不通过
  RUNNING: 3,     // 投放中
  TERMINATED: 4,  // 投放结束
  WITHDRAWN: 5,   // 投放未开始
}

/** Mock 数据模板 */
const mockDataList = [
  {
    id: '100039100039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000000.0,
    position: 'T02-短视频贴片广告图片最多两行标题超出后用…',
    status: statusEnum.DRAFT,
  },
  {
    id: '10010101010103939',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 50000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.REVIEWING,
  },
  {
    id: '100039222222',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.DRAFT,
  },
  {
    id: '1222323232',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.APPROVED,
  },
  {
    id: '100039222222',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.TERMINATED,
  },
  {
    id: '100039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.DRAFT,
  },
  {
    id: '121212121212121',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.WITHDRAWN,
  },
  {
    id: '100039100039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.RUNNING,
  },
  {
    id: '10003910003910039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 500000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.DRAFT,
  },
  {
    id: '100039100039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.DRAFT,
  },
  {
    id: '100039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.DRAFT,
  },
  {
    id: '100039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.DRAFT,
  },
]

/** 基于模板批量生成 100 条 mock 数据 */
function generateFullMockData() {
  const list = []
  for (let i = 0; i < 100; i++) {
    const base = mockDataList[i % mockDataList.length]
    list.push({
      ...base,
      _uid: i + 1,
    })
  }
  return list
}

const fullData = generateFullMockData()

/**
 * 获取广告计划分页数据（Mock）
 * @param {Object} data - 分页参数 { pageNo, pageSize, planName }
 * @returns {Promise} 模拟后端分页响应，延迟 300ms
 */
export const getAdPlanPage = (data) => {
  return new Promise((resolve) => {
    const { pageNo = 1, pageSize = 10, planName } = data || {}

    let filtered = fullData
    if (planName) {
      filtered = fullData.filter((item) => item.planName.includes(planName))
    }

    const start = (pageNo - 1) * pageSize
    const end = start + pageSize
    const dataList = filtered.slice(start, end)

    setTimeout(() => {
      resolve({
        code: 0,
        msg: 'success',
        data: {
          dataList,
          total: filtered.length,
          current: pageNo,
          size: pageSize,
        },
      })
    }, 300)
  })
}

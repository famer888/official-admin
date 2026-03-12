const statusEnum = {
  DRAFT: 0,
  REVIEWING: 1,
  APPROVED: 2,
  RUNNING: 3,
  TERMINATED: 4,
  WITHDRAWN: 5,
}

const mockDataList = [
  {
    id: '100039100039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000000.0,
    position: 'T02-短视频贴片广告图片广告图片最多两行标题超出后用',
    status: statusEnum.DRAFT,
  },
  {
    id: '10010101010103939',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 50000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.DRAFT,
  },
  {
    id: '100039222222',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 20000.0,
    position: 'T02-短视频贴片广告图片',
    status: statusEnum.REVIEWING,
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
    status: statusEnum.RUNNING,
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
    status: statusEnum.DRAFT,
  },
  {
    id: '10003910003910039',
    planName: '3月-万象APP拉新',
    startDate: '2026.03.01',
    endDate: '2026.03.31',
    budget: 500000.0,
    position: 'T02-短视频贴片广告图片广告图片',
    status: statusEnum.TERMINATED,
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
]

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

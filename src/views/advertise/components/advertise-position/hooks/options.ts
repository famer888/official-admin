export const exposurePlaceholder = '1-9999'

export const pageSizeOptions = [10, 20, 30, 50].map((value) => ({
  label: `${value} / 页`,
  value,
}))

export const statusLegendOptions = [
  { key: 'available', label: '可选', className: 'available' },
  { key: 'disabled', label: '不可选', className: 'disabled' },
  { key: 'occupied', label: '库存占用', className: 'occupied' },
  { key: 'selected', label: '已选', className: 'selected' },
]

// 顶部搜索 ProForm schemas
export const searchSchemas = [
  {
    field: 'appName',
    label: 'APP名称',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入APP的名称',
      clearable: true,
    },
    giProps: { span: 1 },
  },
  {
    field: 'positionKeyword',
    label: '广告位名称',
    component: 'NInput',
    componentProps: {
      placeholder: '关键字段查询',
      clearable: true,
    },
    giProps: { span: 1 },
  },
  {
    field: 'exposureRange',
    label: '预估曝光量',
    slot: 'exposureRange',
    giProps: { span: 1 },
  },
]

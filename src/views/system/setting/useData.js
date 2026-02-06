import { statusOptions, statusMap } from '@/constants'
import { renderTag } from '@/components/ProTable/utils'
import { colorMap } from '@/constants'

export const columns = [
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    width: 100,
  },
  {
    title: '配置名称',
    key: 'configName',
    align: 'center',
    width: 180,
    showFilter: true,
  },
  {
    title: '配置Key',
    key: 'configKey',
    align: 'center',
    width: 180,
    showFilter: true,
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    width: 100,
    showFilter: true,
    render: (row) => renderTag(statusMap[row.status]?.label, colorMap[row.status]),
    component: 'NSelect',
    componentProps: {
      options: statusOptions,
    },
  },
  {
    title: '备注',
    key: 'remark',
    align: 'center',
    width: 180,
  },
  {
    title: '创建人',
    key: 'creator',
    align: 'center',
    width: 180,
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    width: 180,
  },
  {
    title: '更新时间',
    key: 'updateTime',
    align: 'center',
    width: 180,
  },
]

export const schemas = [
  {
    field: 'configName',
    label: '配置名称',
    required: true,
  },
  {
    field: 'configKey',
    label: 'key',
    required: true,
  },
  {
    field: 'configValue',
    label: '值',
    required: true,
  },
  {
    field: 'status',
    label: '状态',
    component: 'NRadioGroup',
    required: true,
    defaultValue: statusOptions[0].value,
    componentProps: {
      options: statusOptions,
    },
  },
  {
    field: 'sortBy',
    label: '排序',
    component: 'NInputNumber',
    defaultValue: 0,
    required: true,
  },
  {
    field: 'remark',
    label: '备注',
    componentProps: {
      type: 'textarea',
    },
  },
]

import { statusOptions, statusMap } from '@/constants'
import { renderTag } from '@/components/ProTable/utils'
import { colorMap } from '@/constants'

export const columns = [
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    width: 80,
  },
  {
    title: '角色名称',
    key: 'name',
    align: 'center',
    width: 100,
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
    width: 120,
  },
  {
    title: '操作人',
    key: 'updater',
    align: 'center',
    width: 120,
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
    field: 'name',
    label: '角色名称',
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
    field: 'remark',
    label: '备注',
    componentProps: {
      type: 'textarea',
    },
  },
]

export const useFuncSchemas = (menus) => [
  {
    field: 'menuIds',
    label: '功能权限',
    component: 'NTree',
    componentProps: {
      data: menus,
      checkable: true,
      cascade: true,
      showLine: true,
    },
  },
]

export const useDataSchemas = (merchantList, onUpdateValue, current) => [
  {
    field: 'merchantCodeList',
    label: '商户权限',
    component: 'NCheckbox',
    required: true,
    triggerType: 'array',
    componentProps: {
      options: merchantList,
      onUpdateValue,
    },
  },
  {
    field: 'product',
    label: '产品权限',
    component: 'NTree',
    triggerType: 'array',
    required: true,
    componentProps: {
      data: current,
      checkable: true,
      cascade: true,
      showLine: true,
    },
  },
]

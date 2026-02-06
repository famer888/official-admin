import { statusOptions, statusMap } from '@/constants'
import { renderTag } from '@/components/ProTable/utils/render'
import { colorMap } from '@/constants' 

export const useColumns = (roleDownBox = []) => [
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    width: 100,
  },
  {
    title: '账号昵称',
    key: 'nickname',
    align: 'center',
    width: 120,
    showFilter: true,
  },
  {
    title: '用户名',
    key: 'username',
    align: 'center',
    width: 120,
  },
  {
    title: '角色名称',
    key: 'roleId',
    align: 'center',
    width: 100,
    render: (row) => roleDownBox.value.find((item) => item.value === row.roleId)?.label ?? '-',
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

export const useFormSchemas = (roleDownBox) => [
  {
    field: 'nickname',
    label: '账号昵称',
    required: true,
  },
  {
    field: 'username',
    label: '用户名',
    required: true,
  },
  {
    field: 'password',
    label: '密码',
    required: true,
  },
  {
    field: 'roleId',
    label: '角色名称',
    component: 'NSelect',
    required: true,
    triggerType: 'number',
    componentProps: {
      options: roleDownBox,
    },
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
]

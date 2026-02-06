import { renderAvatar, renderImage, renderTag as tagRender } from './render'
import { useUserStore } from '@/store/modules/user'

const store = useUserStore()

// 渲染类型映射表
const renderMap = {
  avatar: renderAvatar,
  image: renderImage,
  tag: tagRender,
  // 你可以继续添加其他类型
  // 例如：
  // text: (value) => value,  // 如果需要默认处理
}

/**
 * 生成表格列配置
 * @param {Array} columns - 原始列配置
 * @param {boolean} visibleMerchant - 是否显示商户列
 * @param {boolean} selection - 是否显示选择框列
 * @returns {Array} 处理后的表格列配置
 */
export const processTableData = ({ columns = [], visibleMerchant, selection, merchantChange, selectionProps }) => {
  const insertColumns = [
    // 如果需要选择框列，加入选择框列配置
    ...(selection
      ? [
          {
            type: 'selection',
            width: 60,
            ...selectionProps
          },
        ]
      : []),
    // 如果需要商户列，加入商户列配置
    ...(visibleMerchant
      ? []
      : [
          {
            title: '商户名称',
            key: 'merchantCode',
            align: 'center',
            width: 100,
            render: (row) => row.merchantName,
            showFilter: true,
            component: 'NSelect',
            componentProps: {
              options: store.merchantList,
              onUpdateValue: merchantChange,
            },
          },
        ]),
  ]

  // 渲染每一列的内容
  const columnsList = columns
    .filter((col) => !col.hideInTable) // 过滤掉隐藏列
    .map((col) => {
      const { renderType, key } = col
      const renderFunc = renderMap[renderType] // 根据渲染类型获取渲染函数
      return {
        ...col,
        ...(renderFunc && {
          render: (row) => renderFunc(row[key]), // 调用渲染函数
        }),
      }
    })

  return [...insertColumns, ...columnsList] // 合并所有列配置
}

/**
 * 生成表单字段配置
 * @param {Array} columns - 表格列配置
 * @returns {Array} 表单字段配置
 */
export const useFormData = (columns = [], visibleMerchant, merchantChange) => {
  const insertColumns = visibleMerchant
    ? []
    : [
        {
          title: '商户名称',
          key: 'merchantCode',
          align: 'center',
          width: 100,
          render: (row) => row.merchantName,
          showFilter: true,
          component: 'NSelect',
          componentProps: {
            options: store.merchantList,
            onUpdateValue: merchantChange,
          },
        },
      ]
  const list = [...insertColumns, ...columns]
  return list
    .filter((col) => col.showFilter) // 过滤出需要显示过滤器的字段
    .map((col) => {
      const { key, title, component = 'NInput' } = col

      return {
        ...col,
        field: key,
        component,
        label: title,
      }
    })
}

export const renderTag = tagRender // 导出 tag 渲染函数

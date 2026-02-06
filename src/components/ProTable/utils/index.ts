import { renderAvatar, renderImage, renderTag as tagRender } from './render'
import { useUserStore } from '@/store/modules/user'
import type { BasicColumn } from '@/components/Table/src/types/table'
import type { FormSchema } from '@/components/Form/src/types/form'
import type { ProcessTableDataParams, UseFormDataParams, RenderType } from '../types'

const store = useUserStore()

// ==================== 常量定义 ====================
const DEFAULT_SORT = 999 // 默认排序值
const SELECTION_COLUMN_SORT = 1 // 选择框列排序值
const SELECTION_COLUMN_WIDTH = 60 // 选择框列宽度
const MERCHANT_COLUMN_WIDTH = 100 // 商户列宽度
const DEFAULT_COMPONENT = 'NInput' // 默认表单组件

// 渲染类型映射表
const renderMap: Record<RenderType, (value: any, ...args: any[]) => any> = {
  avatar: renderAvatar,
  image: renderImage,
  tag: tagRender,
}

// ==================== 类型扩展 ====================
interface ExtendedColumn extends BasicColumn {
  renderType?: RenderType
  hideInTable?: boolean
  showFilter?: boolean
  sort?: number
  component?: string
}

// ==================== 工具函数 ====================
/**
 * 创建选择框列配置
 */
const createSelectionColumn = (selectionProps?: Recordable): BasicColumn => {
  return {
    field: 'selection',
    key: 'selection',
    type: 'selection',
    width: SELECTION_COLUMN_WIDTH,
    sort: SELECTION_COLUMN_SORT,
    ...selectionProps,
  } as unknown as BasicColumn
}

/**
 * 创建商户列配置
 */
const createMerchantColumn = (
  merchantChange?: (value: any) => void,
  merchantComponentProps?: Recordable,
  merchantProps?: Recordable,
  includeFilterable = false
): BasicColumn => ({
  title: '商户名称',
  key: 'merchantCode',
  align: 'center',
  width: MERCHANT_COLUMN_WIDTH,
  render: (row: Recordable) => row.merchantName,
  showFilter: true,
  component: 'NSelect',
  componentProps: {
    options: store.merchantList,
    onUpdateValue: merchantChange,
    ...(includeFilterable && { filterable: true }),
    ...merchantComponentProps,
  },
  ...merchantProps,
} as BasicColumn)

/**
 * 应用列渲染函数
 */
const applyColumnRender = (col: ExtendedColumn): BasicColumn => {
  const { renderType, key } = col
  const renderFunc = renderType ? renderMap[renderType] : null

  if (renderFunc && key) {
    return {
      ...col,
      render: (row: Recordable) => renderFunc(row[key]),
    } as BasicColumn
  }

  return col as BasicColumn
}

/**
 * 按 sort 字段排序列
 */
const sortColumns = (columns: BasicColumn[]): BasicColumn[] => {
  return columns.sort((a, b) => {
    const sortA = (a as ExtendedColumn).sort ?? DEFAULT_SORT
    const sortB = (b as ExtendedColumn).sort ?? DEFAULT_SORT
    return sortA - sortB
  })
}

/**
 * 转换列配置为表单字段配置
 */
const convertToFormSchema = (col: ExtendedColumn): FormSchema => {
  const { key, title, component = DEFAULT_COMPONENT } = col
  return {
    ...col,
    field: key,
    component,
    label: title,
  } as FormSchema
}

// ==================== 导出函数 ====================
/**
 * 生成表格列配置
 * @param params - 处理参数
 * @returns 处理后的表格列配置
 */
export const processTableData = ({
  columns = [],
  visibleMerchant,
  selection,
  merchantChange,
  selectionProps,
  merchantComponentProps,
  merchantProps,
}: ProcessTableDataParams): BasicColumn[] => {
  const insertColumns: BasicColumn[] = []

  // 添加选择框列
  if (selection) {
    insertColumns.push(createSelectionColumn(selectionProps))
  }

  // 添加商户列
  if (!visibleMerchant) {
    insertColumns.push(
      createMerchantColumn(merchantChange, merchantComponentProps, merchantProps)
    )
  }

  // 处理列渲染并过滤隐藏列
  const processedColumns = columns
    .filter((col) => !(col as ExtendedColumn).hideInTable)
    .map(applyColumnRender)

  // 合并并排序
  return sortColumns([...insertColumns, ...processedColumns])
}

/**
 * 生成表单字段配置
 * @param params - 表单数据参数
 * @returns 表单字段配置数组
 */
export const useFormData = ({
  columns = [],
  visibleMerchant,
  merchantChange,
  merchantComponentProps,
  merchantProps,
}: UseFormDataParams): FormSchema[] => {
  const insertColumns: BasicColumn[] = []

  // 添加商户列（表单中需要 filterable）
  if (!visibleMerchant) {
    insertColumns.push(
      createMerchantColumn(
        merchantChange,
        merchantComponentProps,
        merchantProps,
        true // 表单中需要 filterable
      )
    )
  }

  // 合并列并转换为表单配置
  const allColumns = [...insertColumns, ...columns]
  return allColumns
    .filter((col) => (col as ExtendedColumn).showFilter)
    .map(convertToFormSchema)
}

// ==================== 导出渲染函数 ====================
export const renderTag = tagRender
export { renderAvatar, renderImage } from './render'


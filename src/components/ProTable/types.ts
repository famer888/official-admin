import type { BasicColumn } from '@/components/Table/src/types/table'
import type { ComponentPublicInstance } from 'vue'
import { ComponentType } from '../Form'

type TableColumn = BasicColumn & {
  showFilter?: boolean
  component?: ComponentType
  componentProps?: Recordable
}

/**
 * ProTable Props 类型定义
 */
export interface ProTableProps {
  tableProps?: Recordable
  columns?: TableColumn[]
  actions?: ProTableAction[]
  permissions?: string[]
  request?: (params: Recordable) => Promise<ProTableResponse>
  actionProps?: Recordable
  formProps?: Recordable
  useScrollX?: boolean
  visibleMerchant?: boolean
  selection?: boolean
  selectionProps?: Recordable
  merchantComponentProps?: Recordable
  merchantProps?: Recordable
  containerProps?: Recordable
}

/**
 * ProTable Action 类型定义
 */
export interface ProTableAction {
  label?: string | ((record: Recordable) => string)
  type?: string | ((record: Recordable) => string)
  onClick: (record: Recordable) => void
  ifShow?: (record: Recordable) => boolean
  [key: string]: any
}

/**
 * ProTable 响应数据类型
 */
export interface ProTableResponse {
  code: number
  data?: {
    current?: number
    pageNo?: number
    total?: number
    size?: number
    dataList?: Recordable[]
    [key: string]: any
  }
}

/**
 * ProTable 处理后的数据格式
 */
export interface ProTableData {
  pageNo: number
  pageCount: number
  dataList: Recordable[]
  [key: string]: any
}

/**
 * 表格列配置处理参数
 */
export interface ProcessTableDataParams {
  columns?: BasicColumn[]
  visibleMerchant?: boolean
  selection?: boolean
  merchantChange?: (value: any) => void
  selectionProps?: Recordable
  merchantComponentProps?: Recordable
  merchantProps?: Recordable
}

/**
 * 表单数据配置参数
 */
export interface UseFormDataParams {
  columns?: BasicColumn[]
  visibleMerchant?: boolean
  merchantChange?: (value: any) => void
  merchantComponentProps?: Recordable
  merchantProps?: Recordable
}

/**
 * ProTable 实例类型
 */
export interface ProTableInstance {
  table: ComponentPublicInstance | null
  form: ComponentPublicInstance | null
  setFieldsValue: (values: Recordable) => void
}

/**
 * 渲染类型映射
 */
export type RenderType = 'avatar' | 'image' | 'tag'

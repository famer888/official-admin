import { VNode } from 'vue'
import { BasicColumn } from '../Table'
import { FormProps } from '../Form'
import { PaginationProps } from 'naive-ui'

export type TitleProps = {
  title: VNode
  icon?: VNode
}

export type FormActions = {
  getFieldsValue: () => Recordable
  getFieldValue: (field: string) => any
  setFieldValue: (field: string, value: any) => void
  resetFields: () => void
  validateFields: (fields?: string[]) => Promise<boolean>
} & Record<string, any>

export interface DataTableProps {
  columns?: Array<
    BasicColumn & { showFilter?: boolean; component?: string; componentProps?: Recordable }
  >
  data?: Array<Recordable>
  title?: false | TitleProps
  toolbar?: VNode
  request: (params: Recordable) => Promise<Response>
  formProps?: FormProps & { permissions?: Array<string> }
  paginationProps?: PaginationProps
  pagination?: boolean
}

export type Response = {
  code: number
  msg: string
  data: {
    dataList: Array<Recordable>
    total: number
    current: number
    size: number
  }
}

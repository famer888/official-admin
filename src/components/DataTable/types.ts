import { BasicColumn } from '../Table'

export interface DataTableProps {
  columns?: Array<BasicColumn>
  data?: Array<Recordable>
  hiddenTitle?: boolean
  hiddenToolbar?: boolean
  request: (params: Recordable) => Promise<Response>
  filterProps?: Recordable
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

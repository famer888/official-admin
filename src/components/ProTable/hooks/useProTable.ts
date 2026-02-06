import { reactive, h, computed, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { TableAction } from '@/components/Table'
import { useForm } from '@/components/Form/index'
import { processTableData, useFormData } from '../utils'
import { removeEmptyString } from '../../ProForm/utils'
import { usePermission } from '@/hooks/web/usePermission'
import type { ProTableProps, ProTableAction, ProTableData } from '../types'
import type { BasicColumn } from '@/components/Table/src/types/table'

/**
 * ProTable Hook
 */
export function useProTable(
  props: ProTableProps,
  emit: (event: string, ...args: any[]) => void,
  attrs: Recordable
) {
  const { hasPermission } = usePermission()
  const show = computed(() => hasPermission(props.permissions || []))

  const form = useTemplateRef<ComponentPublicInstance>('formRef')
  const table = useTemplateRef<ComponentPublicInstance>('tableRef')

  // 商户变化处理（防重复触发）
  let lastMerchant: any = null
  const merchantChange = (e: any) => {
    if (e === lastMerchant) return // 值没变，不触发
    lastMerchant = e
    emit('merchantChange', e)
  }

  // 处理选择框变化
  const handleCheck = (keys: any[], records: Recordable[]) => {
    emit('update:checked-row-keys', keys, records)
  }

  // 表格列配置
  const tableColumns = computed(() =>
    processTableData({
      columns: props.columns || [],
      visibleMerchant: props.visibleMerchant,
      selection: props.selection,
      merchantChange,
      selectionProps: props.selectionProps,
      merchantComponentProps: props.merchantComponentProps,
      merchantProps: props.merchantProps,
    })
  )

  // 映射操作按钮
  const mapActions = (record: Recordable): ProTableAction[] =>
    (props.actions || []).map((item: any) => ({
      ...item,
      onClick: () => item.onClick(record),
      label:
        typeof item.label === 'string' ? item.label : item.label?.(record) || '',
      type:
        typeof item.type === 'string' ? item.type : item.type?.(record) || 'default',
      ifShow: item.ifShow ? item.ifShow(record) : true,
    }))

  // 操作列配置
  const actionColumn = reactive<BasicColumn>({
    width: 100,
    title: '操作',
    align: 'center',
    key: 'action',
    fixed: 'right',
    render(record: Recordable) {
      return h(TableAction, {
        style: 'button',
        actions: mapActions(record),
      })
    },
    ...(props.actionProps || {}),
  } as BasicColumn)

  // 横向滚动配置
  const scrollBind = computed(() =>
    props.useScrollX
      ? {
          scrollX:
            tableColumns.value.reduce(
              (sum: number, item: BasicColumn) => sum + (item.width as number || 0),
              0
            ) + (props.actions?.length ? actionColumn?.width as number || 0 : 0),
        }
      : {}
  )

  // 表格绑定属性
  const bindProps = computed(() => ({
    ...props.tableProps,
    ...scrollBind.value,
    ...(props.actions?.length ? { actionColumn } : {}),
    ...attrs,
  }))

  // 数据加载
  let lastQuery: Recordable = {}
  const loadDataTable = async (e: Recordable): Promise<ProTableData | undefined> => {
    const params = removeEmptyString(getFieldsValue())
    const res = await props.request?.({
      ...e,
      ...params,
    })

    if (res?.code === 0) {
      const d = res.data || {}
      const data: ProTableData = {
        ...d,
        pageNo: d.pageNo ?? d.current ?? 1,
        pageCount: Math.ceil((d.total || 0) / (d.size || 10)) || 0,
        dataList:
          d.dataList?.map((item: Recordable) => ({
            ...item,
          })) || [],
      }
      emit('change', data)
      return data
    }
  }

  // 表单字段配置
  const schemas = useFormData({
    columns: props.columns || [],
    visibleMerchant: props.visibleMerchant,
    merchantChange,
    merchantComponentProps: props.merchantComponentProps,
    merchantProps: props.merchantProps,
  })

  // 表单注册
  const [register, { getFieldsValue, setFieldsValue }] = useForm({
    gridProps: { cols: '1 s:2 m:3 l:4 xl:5 2xl:6', xGap: '16px' },
    collapsedRows: 5,
    schemas,
    ...props.formProps,
  })

  // 查询提交
  const handleSubmit = () => {
    const params = removeEmptyString(getFieldsValue())
    if (JSON.stringify(lastQuery) !== JSON.stringify(params)) {
      lastQuery = params
      ;(table.value as any)?.updatePage?.(1)
    } else {
      ;(table.value as any)?.reload()
    }
    emit('update:checked-row-keys', [], [])
  }

  // 重置处理
  const handleReset = () => {
    merchantChange(null)
    emit('reset')
    ;(table.value as any)?.updatePage?.(1)
    emit('update:checked-row-keys', [], [])
  }

  // 分页更新
  let lastPageInfo = 1
  const updatePage = (pageInfo: number) => {
    if (lastPageInfo !== pageInfo) {
      lastPageInfo = pageInfo
      emit('update:checked-row-keys', [], [])
    }
  }

  return {
    show, // 是否显示表格（权限控制）
    form, // 表单实例引用
    table, // 表格实例引用
    tableColumns, // 表格列配置
    bindProps, // 表格绑定属性
    loadDataTable, // 数据加载函数
    register, // 表单注册函数
    getFieldsValue, // 获取表单字段值
    setFieldsValue, // 设置表单字段值
    handleSubmit, // 查询提交处理
    handleReset, // 重置处理
    handleCheck, // 处理选择框变化
    updatePage, // 分页更新处理
  }
}


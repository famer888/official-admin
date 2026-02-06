import { DataTableProps } from './types'
import { FormSchema } from '@/components/Form/src/types/form'

const DEFAULT_COMPONENT = 'NInput' // 默认表单组件

export const getSchemas = (
  columns: DataTableProps['columns'] = [],
  onValueChange?: (value: string | number | number[]) => void
): Array<FormSchema> => {
  return columns
    .filter((column) => column.showFilter)
    .map((column) => {
      const { key, title, component = DEFAULT_COMPONENT, ...rest } = column

      return {
        ...rest,
        field: key,
        component,
        label: title,
        componentProps: {
          ...rest.componentProps,
          onUpdateValue: (value: string | number | number[]) => {
            onValueChange?.(value)
          },
        },
      } as FormSchema
    })
}

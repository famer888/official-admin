import { useUserStore } from '@/store/modules/user'

const store = useUserStore()

const placeholerMap = {
  NInput: '请输入',
  NInputNumber: '请输入',
  NSelect: '请选择',
  NTreeSelect: '请选择',
  NRadioGroup: '请选择',
  NCheckbox: '请选择',
  NDatePicker: '请选择',
  NUpload: '请上传',
}

const components = ['NInputNumber', 'NRadioGroup']
function createType(component, type) {
  if (components.includes(component)) {
    return { type: 'number' }
  }
  return { type }
}

const triggerMap = {
  NInput: ['blur', 'change'],
  NInputNumber: ['blur', 'change'],
  NSelect: ['change'],
  NTreeSelect: ['change'],
  NRadioGroup: ['change'],
  NDatePicker: ['change'],
}

function createRule({ required, label, component = 'NInput', triggerType = 'string' }) {
  if (!required) return {}
  return {
    rules: [
      {
        required: true,
        message: placeholerMap[component] + label,
        trigger: triggerMap[component] || ['blur'],
        ...createType(component, triggerType),
      },
    ],
  }
}

const merchant = (visibleMerchant, merchantChange, merchantProps = {}, merchantComponentProps={}) =>
  visibleMerchant
    ? []
    : [
        {
          field: 'merchantCode',
          label: '商户名称',
          component: 'NSelect',
          required: true,
          componentProps: {
            options: store.merchantList,
            onUpdateValue: merchantChange,
            ...merchantComponentProps
          },
          ...merchantProps,
        },
      ]

export const processFormData = (data = [], visibleMerchant, merchantChange, merchantProps, merchantComponentProps) => {
  const list = [...merchant(visibleMerchant, merchantChange, merchantProps, merchantComponentProps), ...data]
  return list.map((item) => {
    const { label, component = 'NInput', componentProps = {} } = item
    return {
      component,
      componentProps: {
        ...componentProps,
      },
      ...createRule(item),
      ...item,
    }
  })
}

export function removeEmptyString(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ''))
}

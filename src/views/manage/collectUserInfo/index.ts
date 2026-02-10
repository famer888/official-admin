import { h, ref } from 'vue'
import useFeedback from '@/composables/useFeedback'
import useAsync from '@/composables/useAsync'
import {
  userScaleMap,
  adBudgetMap,
  adPreferenceMap,
  trafficPreferenceMap,
  industryCategoryMap,
  industryDetailMap,
} from '@/constants/website'
import { completeUserDetail } from './useApi'

// 通用：map -> options
const mapToOptions = (map: Record<number, string>) =>
  Object.entries(map).map(([value, label]) => ({
    label,
    value: Number(value),
  }))

// 用户规模
const userScaleOptions = mapToOptions(userScaleMap)

// 广告预算
const adBudgetOptions = mapToOptions(adBudgetMap)

// 广告类型偏好
const adPreferenceOptions = mapToOptions(adPreferenceMap)

// 流量偏好
const trafficPreferenceOptions = mapToOptions(trafficPreferenceMap)

// 行业大类
const industryCategoryOptions = mapToOptions(industryCategoryMap)

// 根据大类 code 获取小类 options
const getIndustryDetailOptions = (categoryCode?: number) => {
  if (!categoryCode) return []
  return Object.entries(industryDetailMap)
    .filter(([code]) => Math.floor(Number(code) / 100) === categoryCode)
    .map(([value, label]) => ({
      label,
      value: Number(value),
    }))
}

// 收集用户信息弹窗的表单配置（基础 schema，联动逻辑在 modal 中处理）
export const collectUserInfoSchemas = [
  // 公司基础信息
  {
    field: 'companyName',
    label: '公司名称',
    component: 'NInput',
    required: true,
    componentProps: {
      maxlength: 50,
      clearable: true,
    },
  },
  {
    field: 'jobTitle',
    label: '您的身份',
    component: 'NInput',
    required: true,
    componentProps: {
      maxlength: 20,
      clearable: true,
    },
  },
  {
    field: 'industry',
    label: '所属行业（大类）',
    component: 'NSelect',
    triggerType: 'number',
    componentProps: {
      options: industryCategoryOptions,
    },
    required: true,
  },
  {
    field: 'subIndustry',
    label: '所属行业（小类）',
    component: 'NSelect',
    triggerType: 'number',
    required: true,
    componentProps: {
      options: [], // 由大类选择联动填充
    },
  },
  {
    field: 'userScale',
    label: '用户规模',
    component: 'NCheckbox',
    triggerType: 'array',
    giProps: { span: 24 },
    required: true,
    componentProps: {
      options: userScaleOptions,
    },
  },

  // 预计第一波投放预算
  {
    field: 'adBudget',
    label: '您预期一次的广告预算',
    component: 'NCheckbox',
    triggerType: 'array',
    giProps: { span: 24 },
    required: true,
    componentProps: {
      options: adBudgetOptions,
    },
  },

  // 投放诉求
  {
    field: 'adPreference',
    label: '您的广告类型偏好',
    component: 'NCheckbox',
    triggerType: 'array',
    giProps: { span: 24 },
    required: true,
    componentProps: {
      options: adPreferenceOptions,
    },
  },

  // 目标用户类型
  {
    field: 'trafficPreference',
    label: '您的流量偏好',
    component: 'NCheckbox',
    triggerType: 'array',
    giProps: { span: 24 },
    required: true,
    componentProps: {
      options: trafficPreferenceOptions,
    },
  },
]

// 可选：表单级别配置（用于 ProForm 的 formProps）
export const collectUserInfoFormProps = {
  labelWidth: 80,
  labelPlacement: 'top',
  gridProps: { cols: '1 m:2', xGap: 16, yGap: 16 },
  submitButtonText: '保存',
  resetButtonText: '取消',
}

// Checkbox 字段列表
const CHECKBOX_FIELDS = ['userScale', 'adBudget', 'adPreference', 'trafficPreference'] as const

// 工具函数：数组转字符串（逗号分隔）
const arrayToString = (val: any): string =>
  Array.isArray(val) ? val.map(String).join(',') : val ? String(val) : ''

// 工具函数：字符串转数组（用于初始值）
const stringToArray = (val: any): number[] | any =>
  typeof val === 'string' && val
    ? val
        .split(',')
        .filter((v) => v.trim())
        .map((v) => Number(v.trim()))
    : val

// 处理初始值：将字符串转换为数组
const processInitialValues = (initialValues?: Record<string, any>) => {
  if (!initialValues) return {}
  const processed = { ...initialValues }
  CHECKBOX_FIELDS.forEach((field) => {
    if (processed[field]) processed[field] = stringToArray(processed[field])
  })
  return processed
}

// 处理提交数据：将数组转换为字符串
const processSubmitValues = (values: Record<string, any>) => ({
  ...values,
  ...CHECKBOX_FIELDS.reduce((acc, field) => {
    acc[field] = arrayToString(values[field])
    return acc
  }, {} as Record<string, string>),
})

/**
 * 收集用户信息弹窗（配置式）
 *
 * 使用方式：
 * const { openCollectUserInfoModal } = useCollectUserInfoModal()
 * openCollectUserInfoModal({ visible: true })
 */
export function useCollectUserInfoModal() {
  const { showModal } = useFeedback()

  const openCollectUserInfoModal = (options?: {
    visible?: boolean
    initialValues?: Record<string, any>
  }) => {
    if (options?.visible === false) return

    const formRef = ref<any>(null)
    const processedInitialValues = processInitialValues(options?.initialValues)
    const localSchemas = collectUserInfoSchemas.map((schema) => ({
      ...schema,
      componentProps: { ...(schema.componentProps || {}) },
    }))

    // 行业大类/小类联动
    const industrySchema = localSchemas.find((item) => item.field === 'industry')
    const industryDetailSchema = localSchemas.find((item) => item.field === 'subIndustry')

    if (industrySchema && industryDetailSchema) {
      const updateOptions = (category?: number) => {
        ;(industryDetailSchema.componentProps as any).options = getIndustryDetailOptions(category)
      }

      ;(industrySchema.componentProps as any).onUpdateValue = (val: number) => {
        updateOptions(val)
        formRef.value?.setFieldsValue({ subIndustry: null })
      }

      if (processedInitialValues?.industry != null) {
        updateOptions(processedInitialValues.industry)
      }
    }

    let d: any
    const handleSubmit = async (values: Record<string, any>) => {
      await useAsync(() => completeUserDetail(processSubmitValues(values)), formRef.value?.form, [
        d?.destroy,
      ])
    }

    d = showModal({
      title: '完善您的信息，让我们更好地为您服务',
      style: { width: '720px' },
      content: (ProForm) =>
        h(ProForm as any, {
          ref: formRef,
          schemas: localSchemas,
          formProps: collectUserInfoFormProps,
          record: processedInitialValues,
          onSubmit: handleSubmit,
          onClose: () => d?.destroy(),
        }),
    })
  }

  return { openCollectUserInfoModal }
}

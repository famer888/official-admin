import { h, ref } from 'vue'
import useFeedback from '@/composables/useFeedback'
import {
  userScaleMap,
  adBudgetMap,
  adPreferenceMap,
  trafficPreferenceMap,
  industryCategoryMap,
  industryDetailMap,
} from '@/constants/website'

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
    field: 'contactName',
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
    field: 'industryDetail',
    label: '所属行业（小类）',
    component: 'NSelect',
    triggerType: 'number',
    required: true,
    componentProps: {
      options: [], // 由大类选择联动填充
    },
  },
  {
    field: 'adScene',
    label: '用户规模',
    component: 'NRadioGroup',
    giProps: { span: 24 },
    required: true,
    componentProps: {
      options: userScaleOptions,
    },
  },

  // 预计第一波投放预算
  {
    field: 'firstRoundBudget',
    label: '您预期一次的广告预算',
    component: 'NRadioGroup',
    giProps: { span: 24 },
    required: true,
    componentProps: {
      options: adBudgetOptions,
    },
  },

  // 投放诉求
  {
    field: 'demandType',
    label: '您的广告类型偏好',
    component: 'NRadioGroup',
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
    component: 'NRadioGroup',
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

/**
 * 收集用户信息弹窗（配置式）
 *
 * 使用方式：
 * const { openCollectUserInfoModal } = useCollectUserInfoModal()
 * openCollectUserInfoModal({ visible: true })
 */
export function useCollectUserInfoModal() {
  const { showModal } = useFeedback()

  /**
   * 打开弹窗
   * @param options.visible 是否弹出（默认 true）
   * @param options.initialValues 初始表单数据（可选）
   */
  const openCollectUserInfoModal = (options?: {
    visible?: boolean
    initialValues?: Record<string, any>
  }) => {
    const shouldOpen = options?.visible ?? true
    if (!shouldOpen) return

    const formRef = ref<any>(null)
    // 为本次弹窗实例克隆一份 schema，方便在内部做联动修改
    const localSchemas = collectUserInfoSchemas.map((schema) => ({
      ...schema,
      componentProps: {
        ...(schema.componentProps || {}),
      },
    }))

    // 行业大类 / 小类联动
    const industrySchema = localSchemas.find((item) => item.field === 'industry')
    const industryDetailSchema = localSchemas.find((item) => item.field === 'industryDetail')

    const updateIndustryDetailOptions = (category: number | undefined) => {
      if (!industryDetailSchema) return
      // 避免和原始输入组件 props 类型冲突，这里仅在下拉上设置 options
      ;(industryDetailSchema.componentProps as any).options = getIndustryDetailOptions(category)
    }

    if (industrySchema && industryDetailSchema) {
      // 大类变化时，联动小类 options，并清空小类已选
      ;(industrySchema.componentProps as any).onUpdateValue = (val: number) => {
        updateIndustryDetailOptions(val)
        formRef.value?.setFieldsValue({ industryDetail: undefined })
      }

      // 如果有初始值，打开时先根据大类填充一次小类
      const initialIndustry = options?.initialValues?.industry
      if (initialIndustry != null) {
        updateIndustryDetailOptions(initialIndustry)
      }
    }
    let d: any

    const handleSubmit = (values: Record<string, any>) => {
      // TODO: 这里后续接入实际接口
      // 例如：await saveUserInfoApi(values)
      console.log('【收集用户信息】表单提交数据：', values)
      d?.destroy()
    }

    d = showModal({
      title: '完善您的信息，让我们更好地为您服务',
      style: { width: '720px' },
      content: (ProForm) =>
        h(ProForm as any, {
          ref: formRef,
          schemas: localSchemas,
          formProps: collectUserInfoFormProps,
          record: options?.initialValues ?? {},
          onSubmit: handleSubmit,
          onClose: () => d?.destroy(),
        }),
    })
  }

  return { openCollectUserInfoModal }
}



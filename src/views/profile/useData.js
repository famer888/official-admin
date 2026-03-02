import {
  userScaleMap,
  adBudgetMap,
  adPreferenceMap,
  trafficPreferenceMap,
  industryCategoryMap,
  industryDetailMap,
} from '@/constants/website'

// 通用：map -> options
const mapToOptions = (map) =>
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
export const getIndustryDetailOptions = (categoryCode) => {
  if (!categoryCode) return []
  return Object.entries(industryDetailMap)
    .filter(([code]) => Math.floor(Number(code) / 100) === categoryCode)
    .map(([value, label]) => ({
      label,
      value: Number(value),
    }))
}

// 个人信息表单配置
export const userInfoSchemas = [
  {
    field: 'companyName',
    label: '公司名称',
    component: 'NInput',
    required: true,
    giProps: { span: 12 },
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
    giProps: { span: 12 },
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
    giProps: { span: 12 },
    componentProps: {
      options: industryCategoryOptions,
    },
    required: true,
  },
  {
    field: 'subIndustry',
    label: '所属行业（详细）',
    component: 'NSelect',
    triggerType: 'number',
    giProps: { span: 12 },
    required: true,
    componentProps: {
      options: [],
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

// 密码修改表单配置（基础配置）
const passwordSchemasBase = [
  {
    field: 'oldPassword',
    label: '原密码',
    component: 'NInput',
    required: true,
    giProps: { span: 13 },
    componentProps: {
     style: { minWidth: '200px' },
      placeholder: '请输入原密码',
      type: 'password',
      showPasswordOn: 'click',
    },
    rules: [
      {
        validator: (rule, value) => {
          if (!value) {
            return new Error('请输入原密码')
          }
          if (value.length < 8 || value.length > 20) {
            return new Error('密码长度必须在8-20位之间')
          }
          return true
        },
        trigger: ['blur', 'change'],
      },
    ],
  },
  {
    field: 'newPassword',
    label: '新密码',
    component: 'NInput',
    required: true,
    giProps: { span: 13 },
    componentProps: {
      style: { minWidth: '200px' },
      placeholder: '请输入新密码',
      type: 'password',
      showPasswordOn: 'click',
    },
    rules: [
      {
        validator: (rule, value) => {
          if (!value) {
            return new Error('请输入新密码')
          }
          if (value.length < 8 || value.length > 20) {
            return new Error('密码长度必须在8-20位之间')
          }
          return true
        },
        trigger: ['blur', 'change'],
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '再次输入新密码',
    component: 'NInput',
    required: true,
    giProps: { span: 13 },
    componentProps: {
      style: { minWidth: '200px' },
      placeholder: '请再次输入新密码',
      type: 'password',
      showPasswordOn: 'click',
    },
  },
]

// 密码修改表单配置（动态生成，支持密码一致性校验）
export const passwordSchemas = (getNewPassword, setNewPassword) => {
  return passwordSchemasBase.map((schema) => {
    // 为新密码字段添加 onUpdateValue，更新响应式变量
    if (schema.field === 'newPassword') {
      return {
        ...schema,
        componentProps: {
          ...schema.componentProps,
          onUpdateValue: (value) => {
            setNewPassword?.(value)
          },
        },
      }
    }
    // 为确认密码字段添加校验规则，使用最新的新密码值
    if (schema.field === 'confirmPassword') {
      return {
        ...schema,
        rules: [
          {
            validator: (rule, value) => {
              if (!value) {
                return new Error('请再次输入新密码')
              }
              if (value.length < 8 || value.length > 20) {
                return new Error('密码长度必须在8-20位之间')
              }
              // 使用响应式的 newPassword 值
              const newPasswordValue = getNewPassword?.() || ''
              if (value !== newPasswordValue) {
                return new Error('两次输入的密码不一致')
              }
              return true
            },
            trigger: ['blur', 'change'],
          },
        ],
      }
    }
    return schema
  })
}

// Checkbox 字段列表
const CHECKBOX_FIELDS = ['userScale', 'adBudget', 'adPreference', 'trafficPreference']

// 工具函数：数组转字符串（逗号分隔）
const arrayToString = (val) =>
  Array.isArray(val) ? val.map(String).join(',') : val ? String(val) : ''

// 工具函数：字符串转数组（用于初始值）
const stringToArray = (val) =>
  typeof val === 'string' && val
    ? val.split(',').filter((v) => v.trim()).map((v) => Number(v.trim()))
    : val

// 处理初始值：将字符串转换为数组
export const processInitialValues = (initialValues) => {
  if (!initialValues) return {}
  const processed = { ...initialValues }
  CHECKBOX_FIELDS.forEach((field) => {
    if (processed[field]) processed[field] = stringToArray(processed[field])
  })
  return processed
}

// 处理提交数据：将数组转换为字符串
export const processSubmitValues = (values) => ({
  companyName: values.companyName || '',
  jobTitle: values.jobTitle || '',
  industry: values.industry || 0,
  subIndustry: values.subIndustry || 0,
  ...CHECKBOX_FIELDS.reduce((acc, field) => {
    acc[field] = arrayToString(values[field])
    return acc
  }, {}),
})

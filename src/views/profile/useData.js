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

// 密码修改表单配置
export const passwordSchemas = [
  {
    field: 'oldPassword',
    label: '原密码',
    component: 'NInputPassword',
    required: true,
    componentProps: {
      showPasswordOn: 'click',
      placeholder: '请输入原密码',
    },
  },
  {
    field: 'newPassword',
    label: '新密码',
    component: 'NInputPassword',
    required: true,
    componentProps: {
      showPasswordOn: 'click',
      placeholder: '请输入新密码',
    },
  },
  {
    field: 'confirmPassword',
    label: '再次输入新密码',
    component: 'NInputPassword',
    required: true,
    componentProps: {
      showPasswordOn: 'click',
      placeholder: '请再次输入新密码',
    },
  },
]

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

import { ref, reactive, toRaw, unref } from 'vue'
import { FormActions } from '../types'
import { PaginationProps } from 'naive-ui'

export function useForm(initialValues = {}) {
  // 表单数据存储
  const formData = reactive({ ...initialValues })
  // 表单ref引用
  const formRef = ref<FormActions | null>(null)

  // 获取所有字段值（核心方法）
  function getFieldsValue() {
    // toRaw 避免返回响应式对象，返回纯普通对象
    return { ...toRaw(formData) }
  }

  // 获取单个字段值
  function getFieldValue(field) {
    return unref(formData[field])
  }

  // 设置单个字段值
  function setFieldValue(field, value) {
    formData[field] = value
  }

  // 重置表单到初始值
  function resetFields() {
    Object.keys(formData).forEach((key) => {
      formData[key] = initialValues[key] !== undefined ? initialValues[key] : null
    })
  }

  // 表单校验
  async function validateFields(fields) {
    if (!formRef.value) return false
    try {
      await formRef.value.validate(fields)
      return true
    } catch (error) {
      return false
    }
  }

  return {
    formData,
    formRef,
    getFieldsValue,
    getFieldValue,
    setFieldValue,
    resetFields,
    validateFields,
  }
}

export const usePagination = (initialProps: PaginationProps = {}) => {
  // 分页数据存储
  const pagination = reactive({ ...initialProps })

  const updatePage = (page: number) => {
    pagination.page = page
  }

  const updatePageSize = (pageSize: number) => {
    pagination.pageSize = pageSize
  }

  const setPaginationInfo = (info: PaginationProps) => {
    Object.assign(pagination, info)
  }

  return {
    pagination,
    updatePage,
    updatePageSize,
    setPaginationInfo,
  }
}

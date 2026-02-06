<template>
  <n-form inline ref="formRef" :model="formData" v-bind="formProps" :show-label="false">
    <template v-for="schema in schemas" :key="schema.field">
      <n-form-item :path="schema.field" class="h-[35px]">
        <component
          :is="fieldsMap[schema.component || 'NInput']"
          v-model:value="formData[schema.field]"
          v-bind="schema.componentProps"
        >
        </component>
      </n-form-item>
    </template>

    <template v-if="formProps?.showActionButtonGroup">
      <n-form-item class="h-[35px]">
        <n-button @click="handleReset">重置</n-button>
      </n-form-item>
      <n-form-item class="h-[35px]" v-permission="formProps.permissions">
        <n-button type="primary" @click="handleSubmit">查询</n-button>
      </n-form-item>
    </template>
  </n-form>
</template>
<script setup lang="ts">
  import { DataTableProps } from '../types'
  import { getSchemas } from '../useData'
  import { useForm } from '../hooks'
  import { fieldsMap } from './data'
  import { useDebounceFn } from '@vueuse/core'

  type FormProps = Pick<DataTableProps, 'columns' | 'formProps'>

  const emit = defineEmits(['onValueChange', 'submit'])

  const props = withDefaults(defineProps<FormProps>(), {
    columns: () => [],
  })

  const handleValueChange = useDebounceFn((values) => {
    emit('onValueChange', values)
  }, 500)

  const initialValues = computed(() => {
    return (
      props.columns
        ?.filter((col) => col.showFilter)
        .reduce((prev, cur) => {
          prev[cur.key] = cur?.componentProps?.defaultValue || undefined
          return prev
        }, {}) || {}
    )
  })

  const {
    formRef,
    formData,
    getFieldsValue,
    getFieldValue,
    setFieldValue,
    resetFields,
    validateFields,
  } = useForm(initialValues.value)
  const schemas = computed(() => getSchemas(props.columns))

  const handleSubmit = () => {
    emit('submit', getFieldsValue())
  }

  const handleReset = () => {
    resetFields()
    emit('submit', getFieldsValue())
  }

  watch(formData, (values) => {
    if (props?.formProps?.showActionButtonGroup) return
    handleValueChange(values)
  })

  defineExpose({
    formRef,
    getFieldsValue,
    getFieldValue,
    setFieldValue,
    resetFields,
    validateFields,
  })
</script>
<style lang="less" scoped>
  .n-form-item .n-form-item-feedback-wrapper {
    display: none;
  }
</style>

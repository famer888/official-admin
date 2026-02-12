<template>
  <n-spin :show="loading">
    <BasicForm
      ref="formRef"
      class="pro-form pt-3"
      :submit-button-text="formProps.submitButtonText || '提交'"
      :reset-button-text="formProps.resetButtonText || '取消'"
      :submit-button-options="formProps.submitButtonOptions"
      :reset-button-options="formProps.resetButtonOptions"
      @register="register"
      @submit="handleSubmit"
      @reset="handleClose"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </BasicForm>
  </n-spin>
</template>

<script setup>
  import { computed, onMounted, ref, watchEffect } from 'vue'
  import { BasicForm, useForm } from '@/components/Form/index'
  import { processFormData, removeEmptyString } from './utils'

  const emits = defineEmits(['submit', 'close', 'merchantChange'])

  const {
    schemas,
    record,
    loading,
    formProps,
    visibleMerchant,
    merchantProps,
    merchantComponentProps,
  } = defineProps({
    schemas: {
      type: Array,
      default: () => [],
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    visibleMerchant: {
      type: Boolean,
      default: true,
    },
    merchantProps: {
      type: Object,
      default: () => ({}),
    },
    merchantComponentProps: {
      type: Object,
      default: () => ({}),
    },
  })

  const formRef = ref()
  let lastMerchant = null

  const merchantChange = (e) => {
    if (e === lastMerchant) return // 值没变，不触发
    lastMerchant = e
    emits('merchantChange', e)
  }

  const formData = computed(() =>
    processFormData(schemas, visibleMerchant, merchantChange, merchantProps, merchantComponentProps)
  )

  const [register, { getFieldsValue, setFieldsValue, setProps }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    ...formProps,
    schemas: formData.value,
  })

  const handleSubmit = (e) => {
    if (e) {
      emits('submit', removeEmptyString(e))
    }
  }

  const handleClose = () => emits('close')

  const basicProps = async (schemas) => {
    return setProps({
      schemas: processFormData(
        schemas,
        visibleMerchant,
        merchantChange,
        merchantProps,
        merchantComponentProps
      ),
    })
  }

  defineExpose({ form: formRef, getFieldsValue, setFieldsValue, setProps: basicProps })

  watch(
    () => record,
    async (val) => {
      if (val) {
        await nextTick()
        setFieldsValue(val)
      }
    },
    { immediate: true, deep: true }
  )
</script>

<style scoped lang="less">
  .n-form {
    :deep(.n-grid) {
      & > div:last-of-type {
        .n-space {
          margin-top: 24px;
          flex-direction: row-reverse !important;
        }
      }
      .n-input--disabled {
        .n-input__input-el {
          color: #000;
        }
        .n-input__border {
          display: none;
        }
      }
      .n-base-selection--disabled {
        .n-base-selection-input {
          color: #000;
        }
        .n-base-suffix {
          display: none;
        }
        .n-base-selection__border {
          display: none;
        }
      }
    }
  }
</style>

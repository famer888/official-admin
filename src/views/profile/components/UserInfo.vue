<template>
  <div class="py-5 w-full md:w-1/2">
    <div class="mb-6 px-4 py-3 bg-gray-100 rounded text-[#3A82F9]">
      <span class="font-medium mr-2">账户:</span>
      <span>{{ userInfo.loginEmail }}</span>
    </div>

    <pro-form
      ref="formRef"
      :schemas="infoSchemas"
      :form-props="formProps"
      :record="processedUserInfo"
      :loading="loading"
      @submit="handleSubmit"
      @close="() => {}"
      class="user-info-form"
    />
  </div>
</template>

<script setup>
  import { ref, computed, watchEffect, nextTick } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import { storeToRefs } from 'pinia'
  import ProForm from '@/components/ProForm/index.vue'
  import useAsync from '@/composables/useAsync'
  import { getUserInfo, updateUserInfo } from '../useApi'
  import {
    userInfoSchemas,
    processInitialValues,
    processSubmitValues,
    getIndustryDetailOptions,
  } from '../useData'

  const userStore = useUserStore()
  const { info: userInfo } = storeToRefs(userStore)

  const formRef = ref(null)
  const userInfoData = ref({})
  const loading = ref(false)

  // 表单配置
  const formProps = {
    labelWidth: 100,
    labelPlacement: 'top',
    gridProps: { cols: 24, xGap: 10, yGap: 2 },
    submitButtonText: '更新信息',
    showResetButton: false,
    submitButtonOptions: {
      size: 'large', // 明显大一号
      type: 'primary', // 按钮类型
      style: {
        width: '200px', // 宽一点
        borderRadius: '4px', // 做成圆角胶囊
        fontWeight: 500,
      },
    },
  }

  // 处理后的用户信息（用于表单回显）
  const processedUserInfo = computed(() => processInitialValues(userInfoData.value))

  // 行业详情选项（响应式）
  const industryDetailOptions = ref([])

  // 个人信息表单配置（动态生成，支持行业联动）
  const infoSchemas = computed(() => {
    const schemas = userInfoSchemas.map((schema) => {
      const schemaCopy = {
        ...schema,
        componentProps: { ...(schema.componentProps || {}) },
      }

      // 如果是行业详情字段，使用响应式的 options
      if (schema.field === 'subIndustry') {
        schemaCopy.componentProps.options = industryDetailOptions.value
      }

      return schemaCopy
    })

    // 行业大类/小类联动
    const industrySchema = schemas.find((item) => item.field === 'industry')
    if (industrySchema) {
      industrySchema.componentProps.onUpdateValue = async (val) => {
        industryDetailOptions.value = getIndustryDetailOptions(val)
        await nextTick()
        formRef.value?.setFieldsValue?.({ subIndustry: null })
      }
    }

    return schemas
  })

  // 自动监听行业变化，更新选项和表单
  watchEffect(async () => {
    const industry = userInfoData.value?.industry
    if (industry != null) {
      industryDetailOptions.value = getIndustryDetailOptions(industry)
      await nextTick()
      if (formRef.value?.setProps) {
        formRef.value.setProps(infoSchemas.value)
      }
      if (formRef.value?.setFieldsValue && userInfoData.value?.subIndustry) {
        formRef.value.setFieldsValue({ subIndustry: userInfoData.value.subIndustry })
      }
    }
  })

  // 加载用户信息
  const loadUserInfo = async () => {
    try {
      loading.value = true
      const res = await getUserInfo()
      if (res?.code === 0) {
        userInfoData.value = res.data || {}
      }
    } catch (error) {
      console.error('加载用户信息失败：', error)
    } finally {
      loading.value = false
    }
  }

  // 更新个人信息
  const handleSubmit = async (values) => {
    const params = processSubmitValues(values)
    await useAsync(() => updateUserInfo(params), formRef.value?.form, [loadUserInfo])
  }

  // 初始化加载
  loadUserInfo()
</script>

<style lang="less" scoped>
  :deep(.user-info-form) {
    .n-form {
      .n-grid {
        & > div:last-of-type {
          .n-space {
            justify-content: center !important;
            margin-left: 0 !important;
          }
        }
      }
    }
  }
</style>

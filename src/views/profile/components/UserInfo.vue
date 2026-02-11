<template>
  <div class="py-5 w-full md:w-1/2">
    <div class="mb-6 px-4 py-3 bg-gray-100 rounded">
      <span class="font-medium text-gray-600 mr-2">账户:</span>
      <span class="text-gray-800">{{ userInfo.loginEmail }}</span>
    </div>

    <pro-form
      ref="formRef"
      :schemas="infoSchemas"
      :form-props="formProps"
      :record="processedUserInfo"
      @submit="handleSubmit"
      @close="() => {}"
      class="user-info-form"
    />
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue'
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
  }

  // 处理后的用户信息（用于表单回显）
  const processedUserInfo = computed(() => processInitialValues(userInfoData.value))

  // 个人信息表单配置（动态生成，支持行业联动）
  const infoSchemas = computed(() => {
    const schemas = userInfoSchemas.map((schema) => ({
      ...schema,
      componentProps: { ...(schema.componentProps || {}) },
    }))

    // 行业大类/小类联动
    const industrySchema = schemas.find((item) => item.field === 'industry')
    const industryDetailSchema = schemas.find((item) => item.field === 'subIndustry')

    if (industrySchema && industryDetailSchema) {
      const updateOptions = (category) => {
        industryDetailSchema.componentProps.options = getIndustryDetailOptions(category)
      }

      industrySchema.componentProps.onUpdateValue = async (val) => {
        updateOptions(val)
        // 使用 nextTick 确保 formRef 已初始化
        await nextTick()
        if (formRef.value?.setFieldsValue) {
          await formRef.value.setFieldsValue({ subIndustry: null })
        }
      }

      // 如果有初始值，打开时先根据大类填充一次小类
      if (userInfoData.value?.industry != null) {
        updateOptions(userInfoData.value.industry)
      }
    }

    return schemas
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

  // 暴露方法供父组件调用
  defineExpose({
    loadUserInfo,
  })

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

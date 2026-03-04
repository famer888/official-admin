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
  import { ref, computed, nextTick } from 'vue'
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
  const industryDetailOptions = ref([])

  // 表单配置（参考 collectUserInfo）
  const formProps = {
    labelWidth: 100,
    labelPlacement: 'top',
    gridProps: { cols: 24, xGap: 10, yGap: 2 },
    submitButtonText: '更新信息',
    showResetButton: false,
    submitButtonOptions: {
      size: 'large',
      type: 'primary',
      style: { width: '200px', borderRadius: '4px', fontWeight: 500 },
    },
  }

  const processedUserInfo = computed(() => processInitialValues(userInfoData.value))

  // 行业大类/小类联动：一次构建 schemas，联动逻辑集中处理（参考 collectUserInfo）
  const infoSchemas = computed(() => {
    const localSchemas = userInfoSchemas.map((schema) => ({
      ...schema,
      componentProps: { ...(schema.componentProps || {}) },
    }))
    const industrySchema = localSchemas.find((item) => item.field === 'industry')
    const industryDetailSchema = localSchemas.find((item) => item.field === 'subIndustry')
    //初始化
    if (industryDetailSchema.componentProps.options.length === 0) {
      industryDetailSchema.componentProps.options = getIndustryDetailOptions(
        userInfoData.value?.industry
      )
      formRef.value?.setProps?.(localSchemas)
    }
    industrySchema.componentProps.onUpdateValue = async (val) => {
      formRef.value?.setFieldsValue?.({ subIndustry: null })
      industryDetailSchema.componentProps.options = getIndustryDetailOptions(val)
      formRef.value?.setProps?.(localSchemas)
    }
    return localSchemas
  })

  const updateSubIndustryOptions = (category) => {
    industryDetailOptions.value = getIndustryDetailOptions(category)
  }

  const loadUserInfo = async () => {
    try {
      loading.value = true
      const res = await getUserInfo()
      if (res?.code === 0) {
        userInfoData.value = res.data || {}
        updateSubIndustryOptions(userInfoData.value?.industry)
      }
    } catch (error) {
      console.error('加载用户信息失败：', error)
    } finally {
      loading.value = false
    }
  }

  const handleSubmit = async (values) => {
    const params = processSubmitValues(values)
    await useAsync(() => updateUserInfo(params), formRef.value?.form, [
      loadUserInfo,
      userStore.getInfo,
    ])
  }

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

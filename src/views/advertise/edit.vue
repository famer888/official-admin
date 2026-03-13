<template>
  <div class="min-h-full">
    <div class="flex items-center gap-1 text-sm mb-4">
      <span
        class="text-[#333] cursor-pointer hover:text-[#3A82F9]"
        @click="router.push('/advertise/plan')"
      >
        广告管理
      </span>
      <span class="text-[#999]">/</span>
      <span class="text-[#3A82F9]">编辑广告计划</span>
    </div>

    <div class="p-4 bg-white rounded-[8px]">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="广告计划名称" path="planName">
        <n-input
          v-model:value="formData.planName"
          placeholder="最多20个字条，支持中英文及部分特殊符号"
          maxlength="20"
          show-count
          class="!w-[320px] ad-input"
        />
      </n-form-item>

      <n-form-item label="投放位置" path="position">
        <n-button
          type="primary"
          ghost
          class="!w-[144px] !h-[42px] !rounded-[4px]"
          @click="handleSelectPosition"
        >
          选择投放位置
        </n-button>
        <span v-if="formData.position" class="ml-3 text-sm text-[#666]">
          {{ formData.position }}
        </span>
      </n-form-item>
    </n-form>

    <div class="flex items-center gap-3 mt-4">
      <n-button class="!w-[200px] !h-[48px] !rounded-[4px]" @click="handleCancel">取消</n-button>
      <n-button type="primary" class="!w-[200px] !h-[48px] !rounded-[4px]" @click="handleSave">保存</n-button>
    </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'

  defineOptions({
    name: 'AdvertiseEdit',
  })

  const router = useRouter()
  const route = useRoute()

  const formRef = ref(null)
  const formData = reactive({
    planName: '',
    position: '',
  })

  const rules = {
    planName: { required: true, message: '请输入广告计划名称', trigger: 'blur' },
  }

  if (route.query.id) {
    formData.planName = route.query.planName || ''
    formData.position = route.query.position || ''
  }

  const handleSelectPosition = () => {
    window.$message?.info('选择投放位置')
  }

  const handleCancel = () => {
    router.push('/advertise/plan')
  }

  const handleSave = async () => {
    try {
      await formRef.value?.validate()
      window.$message?.success('保存成功')
      router.push('/advertise/plan')
    } catch {
      // validation failed
    }
  }
</script>

<style scoped>
  .ad-input :deep(.n-input__input-el),
  .ad-input :deep(.n-input-wrapper) {
    background-color: #f4f5f9;
  }
</style>

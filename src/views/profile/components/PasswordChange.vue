<template>
  <div class="password-change">
    <pro-form
      ref="formRef"
      :schemas="passwordSchemas"
      :form-props="formProps"
      @submit="handleSubmit"
      @close="() => {}"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import ProForm from '@/components/ProForm/index.vue'
  import useAsync from '@/composables/useAsync'
  import { changePassword } from '../useApi'
  import { passwordSchemas } from '../useData'

  const formRef = ref(null)

  // 表单配置
  const formProps = {
    labelWidth: 120,
    labelPlacement: 'left',
    gridProps: { cols: '1 m:2', xGap: 16, yGap: 16 },
    submitButtonText: '保存',
    showResetButton: false,
  }

  // 修改密码
  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      window.$message?.error('两次输入的密码不一致')
      return
    }

    const params = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    }

    await useAsync(() => changePassword(params), formRef.value?.form, [
      () => {
        formRef.value?.form?.resetFields()
      },
    ])
  }
</script>

<style lang="less" scoped>
  .password-change {
    padding: 20px 0;
  }
</style>

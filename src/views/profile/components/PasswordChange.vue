<template>
  <div class="py-5 w-full md:w-1/2">
    <pro-form
      ref="formRef"
      class="password-change-form"
      :schemas="passwordSchemasConfig"
      :form-props="formProps"
      @submit="handleSubmit"
      @close="() => {}"
    />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import ProForm from '@/components/ProForm/index.vue'
  import useAsync from '@/composables/useAsync'
  import { changePassword } from '../useApi'
  import { passwordSchemas } from '../useData'

  const formRef = ref(null)
  const newPassword = ref('')

  // 动态生成表单配置，确保能访问到最新的新密码值
  const passwordSchemasConfig = computed(() => {
    return passwordSchemas(
      () => newPassword.value, // getNewPassword: 获取新密码值
      (value) => {
        newPassword.value = value // setNewPassword: 设置新密码值
      }
    )
  })
  // 表单配置
  const formProps = {
    labelWidth: 140,
    labelPlacement: 'left',
    gridProps: { cols: 24, xGap: 16, yGap: 16 },
    submitButtonText: '保存',
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

  // 修改密码
  const handleSubmit = async (values) => {
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
  :deep(.password-change-form) {
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

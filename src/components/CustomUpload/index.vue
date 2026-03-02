<template>
  <n-upload v-bind="uploadProps" @update:file-list="handleUpdate" @remove="handleRemove">
    <slot></slot>
  </n-upload>
</template>

<script setup>
  import { ref, watch, computed, useAttrs } from 'vue'
  import { useUser } from '@/store/modules/user'
  import { useMessage } from 'naive-ui'
  import { useSetFileList, useCustomRequest, useValidFileSize, useValidFileRatio } from './hooks'

  const attrs = useAttrs()
  const message = useMessage()

  // ===== 基础配置 =====
  const userStore = useUser()
  const base = userStore.getBase || ''
  const action = import.meta.env.DEV
    ? '/api/admin-api/system/common/uploadFile'
    : '/api/proxy/common/uploadFile'
  const isMulti = attrs.max !== 1
  const fileList = ref([])

  const value = defineModel('value', { type: [String, Array], default: () => [] })

  const emits = defineEmits(['updateValue'])

  // ===== 仅当 value 有值时回显 =====
  watch(
    () => value.value,
    (val) => {
      useSetFileList({ fileList, val, base, isMulti })
      emits('updateValue', value.value)
    },
    { immediate: true, deep: true }
  )

  // ===== Upload 属性 =====
  const uploadProps = computed(() => {
    const props = {
      ...attrs,
      listType: attrs['list-type'] ?? 'image-card',
      fileList: fileList.value,
      'on-update:file-list': handleUpdate,
      'on-before-upload': async (data) => {
        const file = data.file.file

        // 1️⃣ 校验大小
        if (attrs['fileSize']) {
          const validFileSize = useValidFileSize({ file, fileSize: attrs['fileSize'], message })
          if (!validFileSize) {
            return false
          }
        }

        // 2️⃣ 校验尺寸
        if (attrs['ratio']) {
          try {
            await useValidFileRatio({ radio: attrs['ratio'], message, file })
          } catch (err) {
            return false
          }
        }

        // 所有校验通过
        return true
      },
      customRequest,
    }
    return props
  })

  // ===== 上传完成 =====
  const handleUpdate = (e) => {
    fileList.value = e
    if (!isMulti) {
      if (e.length === 0) {
        value.value = ''
        emits('updateValue', '')
      }
    }
  }

  // ===== 自定义上传 =====
  async function customRequest(options) {
    useCustomRequest({
      value,
      message,
      options,
      userStore,
      isMulti,
      action: attrs['action'] || action,
    })
  }

  // 清空文件列表
  const clearFiles = () => {
    fileList.value = []
  }

  // 删除文件
  const handleRemove = async ({ file, fileList }) => {
    if (file.status !== 'finished') {
      message.error('文件上传中，不能删除')

      return false
    }

    const fileIndex = fileList.findIndex((ret) => ret.id === file.id)

    await nextTick()

    if (isMulti) {
      value.value = value.value.filter((ret, index) => index !== fileIndex)
    } else {
      value.value = ''
    }

    emits('updateValue', value.value)
  }

  defineExpose({ clearFiles })
</script>

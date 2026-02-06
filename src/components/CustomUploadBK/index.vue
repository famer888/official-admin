<template>
  <n-upload v-bind="uploadProps" @update:file-list="handleUpdate" @finish="handleFinish" />
</template>

<script setup>
import { ref, watch, computed, useAttrs } from 'vue'
import { useUser } from '@/store/modules/user'
import { useMessage } from 'naive-ui'

const attrs = useAttrs()
const message = useMessage()

// ===== 基础配置 =====
const userStore = useUser()
const token = userStore.getToken
const base = userStore.getBase || ''
const action = '/api/admin-api/system/common/uploadFile'
const headers = { token }
const isMulti = attrs.max !== 1
const fileList = ref([])

const value = defineModel('value', { type: [String, Array], default: () => [] })

// ===== 仅当 value 有值时回显 =====
watch(
  () => value.value,
  (val) => {
    if (val === null || val === undefined || val === '' || !val?.length) {
      return
    }
    const now = Date.now()
    if (isMulti) {
      fileList.value = val.map((rel, i) => ({
        id: `${now}_${i}`,
        name: String(rel).split('/').pop(),
        status: 'finished',
        url: base + rel,
      }))
    } else {
      fileList.value = [
        {
          id: `${now}_${val}`,
          name: String(val).split('/').pop(),
          status: 'finished',
          url: base + val,
        },
      ]
    }
  },
  { immediate: true }
)

// ===== Upload 属性 =====
const uploadProps = computed(() => {
  const props = {
    ...attrs,
    action,
    headers,
    listType: attrs['list-type'] ?? 'image-card',
    fileList: fileList.value,
    'on-update:file-list': handleUpdate,
  }
  return props
})

// ===== 上传完成 =====
const handleUpdate = (e) => {
  fileList.value = e
  if (!isMulti) {
    if (e.length === 0) {
      value.value = ''
    }
  }
}

const handleFinish = ({ file, event }) => {
  try {
    const res = JSON.parse(event.target.response)
    if (res?.code === 0) {
      if (isMulti) {
        value.value = [...value.value, res.data]
      } else {
        value.value = res.data
      }
      message.success('上传成功')
    } else {
      message.error(res?.msg || '上传失败')
    }
  } catch {
    message.error('上传响应解析失败')
  }
}
</script>

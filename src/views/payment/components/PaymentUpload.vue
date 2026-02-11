<template>
  <div class="mt-[50px]">
    <div class="flex justify-between px-[50px]">
      <qr-code></qr-code>
      <div class="flex flex-col items-center gap-2 justify-center">
        <CustomUpload
          class="w-[auto]"
          :accept="'.png,.jpg,.jpeg'"
          :maxSize="1024 * 1024 * 2"
          :max="1"
          @update:value="handleUpdate"
        >
          <n-upload-trigger #="{ handleClick }" abstract>
            <img class="w-[24px] h-[24px]" :src="uploadUrl" alt="" />
          </n-upload-trigger>
        </CustomUpload>
        <div class="text-[#86909C]">上传付款截图凭证</div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import qrCodeUrl from '@/assets/images/qr-code.png'
  import copyUrl from '@/assets/images/copy.svg'
  import uploadUrl from '@/assets/images/upload.svg'
  import { useMessage } from 'naive-ui'
  import QrCode from './QrCode.vue'

  const emit = defineEmits(['change'])
  const message = useMessage()

  const handleUpdate = (value) => {
    emit('change', value)
  }

  const copy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('复制成功')
      })
      .catch((err) => {
        message.error('复制失败')
      })
  }
</script>

<template>
  <div class="mt-[50px]">
    <div class="flex justify-center px-[50px]">
      <qr-code></qr-code>
    </div>
  </div>
</template>
<script setup>
  import qrCodeUrl from '@/assets/images/qr-code.png'
  import copyUrl from '@/assets/images/copy.svg'
  import uploadUrl from '@/assets/images/upload.svg'
  import { useMessage } from 'naive-ui'
  import QrCode from './QrCode.vue'

  const message = useMessage()

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

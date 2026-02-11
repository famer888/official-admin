<template>
  <div class="flex justify-center flex-col gap-1">
    <div class="flex justify-center">
      <n-image class="w-[110px] h-[110px]" :src="url" :fallback-src="qrCodeUrl">
        <template #error>
          <div class="w-full h-full bg-[url('@/assets/images/qr-code.png')] bg-cover">
            <div
              class="w-full h-full bg-white/90 flex items-center justify-center text-[14px] text-[#1D2129] text-center"
              >二维码已过期
              <br />
              请重新获取</div
            >
          </div>
        </template>
      </n-image>
    </div>

    <!-- 倒计时 -->
    <div class="flex h-[20px] justify-center items-center">
      <span v-if="validUrl">倒计时：{{ countdown }}</span>
    </div>

    <template v-if="validUrl">
      <div class="flex gap-2 items-center text-[#86909C]" @click="copy('123456789serewreWoc')">
        <span>地址：123456789serewreWoc</span>
        <img class="w-[16px] h-[16px] cursor-pointer" :src="copyUrl" alt="" />
      </div>
    </template>
    <template v-else>
      <div
        class="flex w-[170px] py-1 gap-2 items-center justify-center bg-[#F4F5F9] text-[#86909C] rounded-[60px]"
      >
        <span>点击获取新地址</span>
      </div>
    </template>
  </div>
</template>
<script setup>
  import qrCodeUrl from '@/assets/images/qr-code.png'
  import copyUrl from '@/assets/images/copy.svg'
  import { useMessage } from 'naive-ui'

  const emit = defineEmits(['change'])
  const props = defineProps({
    url: {
      type: String,
      default: () => 'DEFAULT_QR_CODE_URL',
    },
  })

  const message = useMessage()
  const validUrl = computed(() => props.url !== 'DEFAULT_QR_CODE_URL')

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

<template>
  <div class="text-[14px]">
    <div v-if="!showUpload" class="flex flex-col gap-6 text-center">
      <div class="text-[16px] font-bold text-center">跳转支付页面</div>
      <div>即将跳转至支付平台页面，<br />请您支付前仔细核对支付金额及订单信息</div>
      <div
        >支付成功后，请<span class="text=[#FF292D] font-bold">截图保存</span
        ><br />稍后需要您上传此截图作为付款凭证</div
      >
      <div>
        <n-button type="primary" @click="navigateToPay">我会保存支付截图，前往充值</n-button>
      </div>
    </div>
    <div class="flex flex-col gap-6" v-else>
      <!-- <div class="text-[16px] font-bold text-center">等待支付结果</div>
      <div>如遇支付失败，<br />请返回存款管理页创建新的支付订单</div>
      <div class="text-center">支付成功请上传支付截图</div> -->

      <!-- <UploadPayScreenshot :id="props.id" @cancel="handleCancel"></UploadPayScreenshot> -->
    </div>
  </div>
</template>
<script setup>
  import uploadUrl from '@/assets/images/upload.svg'
  import { submitOrderScreenshot } from '../useApi'
  import { useRequest } from '@/composables/useRequest'
  import { inject, ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import UploadPayScreenshot from './UploadPayScreenshot.vue'

  const props = defineProps({
    url: {
      type: String,
      default: '',
    },
    id: {
      type: Number,
      default: '',
    },
    handleCancel: {
      type: Function,
      default: () => {},
    },
  })

  const showUpload = ref(false)

  const navigateToPay = () => {
    if (props.url) {
      showUpload.value = true
      props.handleCancel()
      window.open(props.url, '_blank')
    }
  }
</script>

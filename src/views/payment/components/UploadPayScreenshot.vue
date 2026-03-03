<template>
  <div class="flex flex-col gap-8 pt-12">
    <div class="text-[16px] text-[#1D2129] font-bold">请上传支付成功截图</div>
    <div class="text-[#86909C] text-[14px]">
      如遇支付失败，<br />
      请返回存款管理页创建新的支付订单！
    </div>
    <div class="text-[16px] text-[#1D2129] font-bold"> 上传付款截图凭证 </div>
    <CustomUpload
      class="w-[auto]"
      :accept="'.png,.jpg,.jpeg'"
      :maxSize="1024 * 1024 * 2"
      :max="1"
      v-model:value="payVoucher"
    >
      <n-upload-trigger #="{ handleClick }" abstract>
        <img class="w-[24px] h-[24px]" :src="uploadUrl" alt="" />
      </n-upload-trigger>
    </CustomUpload>
    <div class="flex justify-between items-center">
      <n-button class="w-[180px] h-[48px]" @click="handleCancel"> 取消 </n-button>
      <n-button
        class="w-[180px] h-[48px]"
        type="primary"
        @click="submitOrderScreenshotRun"
        :loading="loading"
        :disabled="!payVoucher"
        >上传支付截图</n-button
      >
    </div>
  </div>
</template>
<script setup>
  import uploadUrl from '@/assets/images/upload.svg'
  import { useRequest } from '@/composables/useRequest'
  import { useMessage } from 'naive-ui'
  import { submitOrderScreenshot } from '../useApi'
  import { useUser } from '@/store/modules/user'

  const emits = defineEmits(['cancel'])

  const props = defineProps({
    id: {
      type: Number,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  })

  const user = useUser()
  const payVoucher = ref(props.url)
  const message = useMessage()
  const base = user.getBase || ''

  const { run: submitOrderScreenshotRun, loading } = useRequest(
    () =>
      submitOrderScreenshot({
        id: props.id,
        payVoucher: payVoucher.value,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        message.success('上传支付凭据成功')
        emits('cancel')
      },
    }
  )

  const handleCancel = () => {
    emits('cancel')
  }
</script>
<style lang="less">
  .upload-image-container {
    & .n-dialog__title {
      position: absolute;
      left: 0px;
      top: 0;
      width: 100%;
      height: 56px;
      background: #e8edf8;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
</style>

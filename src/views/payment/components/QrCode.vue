<template>
  <n-spin :show="loading">
    <div class="flex justify-center flex-col gap-1">
      <template v-if="validUrl">
        <div class="flex gap-2 items-center text-[#86909C]" @click="copy('123456789serewreWoc')">
          <span>地址：123456789serewreWoc</span>
          <img class="w-[16px] h-[16px] cursor-pointer" :src="copyUrl" alt="" />
        </div>
      </template>
      <template v-else>
        <div
          class="flex w-[170px] py-1 gap-2 cursor-pointer items-center justify-center bg-[#F4F5F9] text-[#86909C] rounded-[60px]"
          @click="getPayInfo"
        >
          <span>获取充值地址</span>
          <img class="w-[16px] h-[16px] cursor-pointer" :src="reloadUrl" alt="" />
        </div>
      </template>
    </div>
  </n-spin>
</template>
<script setup>
  import qrCodeUrl from '@/assets/images/qr-code.png'
  import copyUrl from '@/assets/images/copy.svg'
  import reloadUrl from '@/assets/images/reload.svg'
  import { useMessage, useDialog } from 'naive-ui'
  import { createOrder } from '../useApi'
  import { useRequest } from '@/composables/useRequest'
  import { inject, ref } from 'vue'
  import NavToPay from './NavToPay.vue'

  const emit = defineEmits(['change'])

  const { formValue, handleCancelDeposit } = inject('info')
  const orderInfo = ref(null)
  const dialog = useDialog()

  const { run: createOrderRun, loading } = useRequest(createOrder, {
    manual: true,
    debounce: 500,
    onSuccess: (res) => {
      orderInfo.value = res

      dialog.create({
        title: undefined,
        titleClass: 'flex justify-center',
        showIcon: false,
        content: () => {
          return h(NavToPay, {
            url: orderInfo.value?.payUrl,
            id: orderInfo.value?.id,
            handleCancel,
          })
        },
      })
    },
    onError: (err) => {},
  })

  const url = ref('DEFAULT_QR_CODE_URL')
  const countdown = ref(0)

  const message = useMessage()
  const validUrl = computed(() => url.value !== 'DEFAULT_QR_CODE_URL')

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

  const getPayInfo = () => {
    if (loading.value) {
      return
    }

    if (!formValue.payFee) {
      message.error('请输入付款金额')
      return
    }

    if (formValue.payFee < 100) {
      message.error('最低付款金额为 100.00 ERC20/TRC20')
      return
    }

    createOrderRun({ payFee: formValue.payFee, payType: formValue.payType })
  }

  const handleCancel = () => {
    dialog.destroyAll()
    handleCancelDeposit()
  }
</script>

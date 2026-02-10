<template>
  <div>
    <payment-method @change="handlePaymentMethod" />

    <payment-amount
      @change-amount="handlePaymentAmount"
      @change-pay-voucher="handlePaymentUpload"
    />

    <div class="mt-[30px]">
      <div> 最低付款金额为 <span class="text-[#FF292D] font-bold">100.00</span> ERC20/TRC20 </div>
      <div> 付款佣金: <span class="text-[#FF292D] font-bold">$0.00</span> </div>
    </div>
  </div>

  <div class="mt-[30px] flex items-center justify-center gap-5">
    <n-button class="w-[200px] h-[48px]" @click="handleCancel">取消</n-button>
    <n-button class="w-[200px] h-[48px]" type="primary" @click="handleSubmit" :loading="loading"
      >付款</n-button
    >
  </div>
</template>
<script setup>
  import PaymentMethod from './PaymentMethod.vue'
  import PaymentAmount from './PaymentAmount.vue'
  import { createOrder } from '../useApi'
  import { useRequest } from '@/composables/useRequest'
  import { useMessage } from 'naive-ui'

  const emit = defineEmits(['cancel', 'submit'])
  const message = useMessage()

  const { run: createOrderRun, loading } = useRequest(createOrder, {
    manual: true,
    onSuccess: (res) => {
      message.success('付款成功')
      emit('submit', res)
    },
    onError: (err) => {
      message.error(err.message || '付款失败')
    },
  })

  const formValue = reactive({
    payFee: 200,
    payType: 0,
    payVoucher: undefined,
  })

  const handleCancel = () => {
    emit('cancel')
  }

  const handleSubmit = async () => {
    createOrderRun(formValue)
  }

  const handlePaymentMethod = (value) => {
    formValue.payType = value
  }

  const handlePaymentAmount = (value) => {
    formValue.payFee = value
  }

  const handlePaymentUpload = (value) => {
    formValue.payVoucher = value
  }
</script>

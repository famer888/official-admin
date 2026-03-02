<template>
  <template v-if="!formValue.showPayVoucher">
    <div>
      <payment-method />

      <payment-amount />

      <div class="mt-[30px]">
        <div> 最低付款金额为 <span class="text-[#FF292D] font-bold">100.00</span> ERC20/TRC20 </div>
        <div> 付款佣金: <span class="text-[#FF292D] font-bold">$0.00</span> </div>
      </div>
    </div>

    <div class="mt-[30px] flex items-center justify-center gap-5">
      <n-button class="w-[200px] h-[48px]" @click="handleCancel">取消</n-button>
    </div>
  </template>
</template>
<script setup>
  import PaymentMethod from './PaymentMethod.vue'
  import PaymentAmount from './PaymentAmount.vue'
  import { useRequest } from '@/composables/useRequest'
  import { useMessage } from 'naive-ui'
  import { provide, inject } from 'vue'

  const emit = defineEmits(['cancel'])

  const formValue = reactive({
    payFee: 0,
    payType: 0,
    showPayVoucher: false,
  })

  const message = useMessage()

  const handleCancel = () => {
    emit('cancel')
  }

  provide('info', {
    formValue,
    handleCancelDeposit: handleCancel,
  })
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

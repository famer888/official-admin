<template>
  <div class="mt-3">
    <div class="py-2 font-bold">付款金额</div>
    <div
      class="flex w-[264px] h-[42px] bg-[#F4F5F9] items-center justify-between rounded-[4px] border border-[#000]"
    >
      <div class="flex items-center gap-2 px-4 rounded-[4px]">
        <span class="text-[16px] text-[#1D2129]">金额</span>
        <span class="text-[20px] text-[#FF292D] font-bold">{{ currentAmount.label }}</span>
      </div>
      <span class="text-[16px] text-[#86909C] px-4">USD</span>
    </div>
  </div>

  <div class="mt-3">
    <div class="flex gap-2">
      <template v-for="amount in payAmountOptions" :key="amount.value">
        <div
          class="flex items-center min-w-[85px] h-[42px] justify-center text-[#1D2129] text-[16px] bg-[#F4F5F9] rounded-[4px] cursor-pointer"
          :class="{ 'bg-[#3A82F9] text-[#fff]': currentAmount.value === amount.value }"
          @click="handleChange(amount)"
          >{{ amount.label }}</div
        >
      </template>
    </div>
  </div>

  <template v-if="currentAmount.value === 1">
    <div
      class="flex flex-col gap-5 h-[160px] mt-[50px] justify-center items-center bg-[#F4F5F9] rounded-[8px]"
    >
      <div class="text-[#86909C]">充值请联系贵宾专员</div>
      <div class="flex gap-2 text-[16px] text-[#1D2129] cursor-pointer items-center">
        <span>Telegram：@12312432423</span>
        <img class="w-[16px] h-[16px]" :src="copyUrl" alt="" />
      </div>
      <div class="text-[14px] text-[#FF292D]"
        >*敬请贵宾在充值前，与平台官方再次确认专员联络方式是否正确</div
      >
    </div>
  </template>
  <template v-else>
    <payment-upload @change="handlePayVoucherChange"></payment-upload>
  </template>
</template>
<script setup>
  import { payAmountOptions } from './useData'
  import PaymentUpload from './PaymentUpload.vue'
  import copyUrl from '@/assets/images/copy.svg'

  const emits = defineEmits(['changeAmount', 'changePayVoucher'])

  const currentAmount = reactive({
    value: 200,
    label: '200',
  })
  const showBigPayment = ref(false)

  const handleChange = (amount) => {
    Object.assign(currentAmount, amount)
    emits('changeAmount', amount.value)
  }

  const handlePayVoucherChange = (value) => {
    emits('changePayVoucher', value)
  }
</script>

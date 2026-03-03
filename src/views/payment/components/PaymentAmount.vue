<template>
  <div class="mt-3">
    <div class="py-2 font-bold">付款金额</div>
    <div class="flex w-[264px] h-[42px]">
      <n-input-number
        v-model:value="currentAmount.value"
        class="amount-input flex items-center w-full h-[42px] text-[red] border-none bg-transparent line-height-[42px] text-[20px]"
        :class="{
          'border-[#000]': !showBigPayment,
          'border-[#f4f5f9]': showBigPayment,
        }"
        :show-button="false"
        :readonly="showBigPayment"
        clearable
        :min="100"
        :max="1500"
        placeholder=""
      >
        <template #prefix>
          <span class="text-[16px] text-[#1D2129]">金额</span>
        </template>
        <template #suffix>
          <span class="text-[16px] text-[#86909C]">USD</span>
        </template>
      </n-input-number>
    </div>
  </div>

  <div class="mt-3">
    <div class="flex gap-2">
      <template v-for="amount in payAmountOptions" :key="amount.value">
        <div
          class="flex items-center min-w-[85px] h-[42px] justify-center text-[16px] rounded-[4px] cursor-pointer"
          :class="{
            'bg-[#3A82F9] text-[#fff]': currentAmount.value === amount.value,
            'bg-[#F4F5F9] text-[#1D2129]': currentAmount.value !== amount.value,
          }"
          @click="handleChange(amount)"
          >{{ amount.label }}</div
        >
      </template>
    </div>
  </div>

  <template v-if="showBigPayment">
    <div
      class="flex flex-col gap-5 h-[160px] mt-[50px] justify-center items-center bg-[#F4F5F9] rounded-[8px]"
    >
      <div class="text-[#86909C]">充值请联系贵宾专员</div>
      <div class="flex gap-2 text-[16px] text-[#1D2129] cursor-pointer items-center">
        <span>Telegram：@12312432423</span>
        <img class="w-[16px] h-[16px]" :src="copyUrl" alt="" @click="copyTelegram" />
      </div>
      <div class="text-[14px] text-[#FF292D]"
        >*敬请贵宾在充值前，与平台官方再次确认专员联络方式是否正确</div
      >
    </div>
  </template>
  <template v-else>
    <payment-upload />
  </template>
</template>
<script setup>
  import { payAmountOptions } from '../useData'
  import PaymentUpload from './PaymentUpload.vue'
  import copyUrl from '@/assets/images/copy.svg'
  import { useMessage } from 'naive-ui'
  import { inject } from 'vue'

  const message = useMessage()
  const { formValue } = inject('info')

  const currentAmount = reactive({
    value: undefined,
    label: '',
  })
  const showBigPayment = ref(false)

  const amountLabel = computed(() => {
    return !currentAmount.value ? '' : currentAmount.label
  })

  const handleChange = (amount) => {
    Object.assign(currentAmount, amount)
    showBigPayment.value = !amount.value

    formValue.payFee = amount.value
  }

  const copyTelegram = () => {
    const telegramLink = '@12312432423'
    navigator.clipboard
      .writeText(telegramLink)
      .then(() => {
        message.success('复制成功')
      })
      .catch((err) => {
        message.error('复制失败')
      })
  }
</script>
<style lang="less" scoped>
  .amount-input {
    :deep(.n-input) {
      background-color: transparent;
      height: 42px !important;

      & .n-input__input {
        display: flex;
        align-items: center;

        & .n-input__input-el {
          color: #ff292d;
          font-weight: bold;
          font-size: 20px;
        }
      }
    }
  }
</style>

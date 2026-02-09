<template>
  <div>
    <div class="py-2 font-bold">选择支付方式</div>
    <div class="grid grid-cols-2 gap-4">
      <template v-for="method in payMethod" :key="method.value">
        <div
          class="flex gap-2 items-center px-4 h-[42px] text-left text-[#1D2129] text-[16px] bg-[#F4F5F9] rounded-[4px] cursor-pointer"
          :class="{ 'bg-[#3A82F9] text-[#fff]': current === method.value }"
          @click="handleChange(method.value)"
        >
          <img :src="method.icon" alt="" />
          <span>{{ method.label }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
  import { payMethod } from './useData'

  const emit = defineEmits(['change'])

  const current = ref(0)

  const handleChange = (value) => {
    current.value = value
    emit('change', value)
  }
</script>

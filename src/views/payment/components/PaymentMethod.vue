<template>
  <div>
    <div class="py-2 font-bold">选择支付方式</div>
    <div class="grid grid-cols-2 gap-4">
      <template v-for="method in payMethod" :key="method.value">
        <div
          :class="{
            'bg-[#3A82F9] text-[#fff]': current === method.value,
            'bg-[#F4F5F9] text-[#1D2129]': current !== method.value,
          }"
          class="flex gap-2 items-center px-4 h-[42px] text-left text-[16px] rounded-[4px] cursor-pointer"
          @click="handleChange(method.value)"
        >
          <img :src="current === method.value ? method.icon.active : method.icon.default" alt="" />
          <span>{{ method.label }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
  import { getPayMethod } from '../useData'
  import { useUser } from '@/store/modules/user'
  import { inject } from 'vue'

  const user = useUser()
  const { formValue } = inject('info')

  const payMethod = computed(() => getPayMethod(user.listMap.payType || []))

  const current = ref(0)

  const handleChange = (value) => {
    current.value = value
    formValue.payType = value
  }
</script>

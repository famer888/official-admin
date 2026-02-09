<template>
  <div class="bg-white rounded-lg shadow-md p-6 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#E79D9D]">
    <div class="flex items-center gap-3 mb-6">
      <img src="@/assets/images/supermarket/detail4.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl" style="color: #455980">预估价格</p>
    </div>
    
    <div class="space-y-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="text-sm font-medium text-white px-3 py-1 rounded-lg bg-blue-500 text-center w-14">7日</div>
        <span class="text-lg font-bold text-gray-700">{{ adData?.price7d ? adData.price7d.toFixed(2) : '0.00' }}</span>
        <img src="@/assets/images/supermarket/detail5.svg" alt="$" class="w-5 h-5" />
      </div>
      <div class="flex items-center gap-3">
        <div class="text-sm font-medium text-white px-3 py-1 rounded-lg bg-purple-400 text-center w-14">14日</div>
        <span class="text-lg font-bold text-gray-700">{{ adData?.price14d ? adData.price14d.toFixed(2) : '0.00' }}</span>
        <img src="@/assets/images/supermarket/detail5.svg" alt="$" class="w-5 h-5" />
      </div>
      <div class="flex items-center gap-3">
        <div class="text-sm font-medium text-white px-3 py-1 rounded-lg text-center w-14" style="background-color: #E79D9D">30日</div>
        <span class="text-lg font-bold text-gray-700">{{ adData?.price30d ? adData.price30d.toFixed(2) : '0.00' }}</span>
        <img src="@/assets/images/supermarket/detail5.svg" alt="$" class="w-5 h-5" />
      </div>
    </div>

    <img 
      src="@/assets/images/supermarket/detail6.svg" 
      alt="立即洽谈购买" 
      class="w-1/2 mx-auto cursor-pointer"
      @click="handleNegotiate"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMessage } from 'naive-ui'
import type { AdTypeData } from '../types'

export default defineComponent({
  name: 'PriceCard',
  props: {
    adData: {
      type: Object as () => AdTypeData | undefined,
      default: undefined,
    },
  },
  setup() {
    const message = useMessage()

    const handleNegotiate = () => {
      message.info('洽谈购买功能')
    }

    return {
      handleNegotiate,
    }
  },
})
</script>


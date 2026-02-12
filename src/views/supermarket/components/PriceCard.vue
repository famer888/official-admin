<template>
  <div class="bg-white rounded-lg p-6 relative h-full flex flex-col before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#E79D9D]">
    <div class="flex items-center gap-3 mb-6">
      <img src="@/assets/images/supermarket/detail4.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl" style="color: #455980">预估价格</p>
    </div>
    
    <div class="space-y-4 mb-6">
      <div v-for="priceItem in priceItems" :key="priceItem.key" class="flex items-center gap-3">
        <div 
          class="text-sm font-medium text-white px-3 py-1 rounded-lg text-center w-14"
          :class="priceItem.bgClass"
          :style="priceItem.bgStyle"
        >
          {{ priceItem.label }}
        </div>
        <span class="text-lg font-bold text-gray-700">{{ priceItem.value }}</span>
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

<script setup>
import { computed } from 'vue'
import { useMessage } from 'naive-ui'

const props = defineProps({
  adData: {
    type: Object,
    default: undefined,
  },
})

const message = useMessage()

const handleNegotiate = () => {
  const contactDetails = props.adData?.contactDetails
  if (!contactDetails) {
    message.warning('客服联系方式未配置')
    return
  }

  // 构建 Telegram 链接
  let tgUrl = contactDetails.trim()
    // 如果已经是完整的 URL（http 或 tg://），直接使用
  if (tgUrl.startsWith('http') || tgUrl.startsWith('tg://')) {
    // 已经是完整链接，直接使用
  } else {
    const username = tgUrl.startsWith('@') ? tgUrl.slice(1) : tgUrl
    tgUrl = `tg://resolve?domain=${username}`
  }

  // 打开 Telegram 链接
  window.open(tgUrl, '_blank')
}

const priceItems = computed(() => {
  return [
    {
      key: '7d',
      label: '7日',
      value: props.adData?.price7d ? props.adData.price7d.toFixed(2) : '0.00',
      bgClass: 'bg-blue-500',
      bgStyle: {},
    },
    {
      key: '14d',
      label: '14日',
      value: props.adData?.price14d ? props.adData.price14d.toFixed(2) : '0.00',
      bgClass: 'bg-purple-400',
      bgStyle: {},
    },
    {
      key: '30d',
      label: '30日',
      value: props.adData?.price30d ? props.adData.price30d.toFixed(2) : '0.00',
      bgClass: '',
      bgStyle: { backgroundColor: '#E79D9D' },
    },
  ]
})
</script>


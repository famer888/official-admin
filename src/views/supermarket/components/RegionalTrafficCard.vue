<template>
  <div class="bg-white rounded-lg p-6 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#CE80E8]">
    <div class="flex items-center gap-3 mb-6">
      <img src="@/assets/images/supermarket/detail8.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl text-[#455980] font-['PingFang_SC',sans-serif] font-semibold">地区流量</p>
    </div>
    
    <div class="space-y-4">
      <div
        v-for="(region, index) in regions"
        :key="index"
      >
        <div class="flex items-center gap-4 ">
          <div class="flex-1 bg-gray-200 rounded-full h-2 relative">
            <div
              class="h-2 rounded-full transition-all relative"
              :style="{ 
                width: region.percentage + '%',
                background: `linear-gradient(to right, ${region.gradientFrom}, ${region.gradientTo})`
              }"
            >
              <div
                v-if="region.percentage > 0"
                class="absolute top-1/2 -translate-y-1/2 right-[1px] w-[6px] h-[6px] bg-white rounded-full"
                style="z-index: 10;"
              ></div>
            </div>
          </div>
          <span class="text-sm text-gray-700 w-20 flex-shrink-0 text-right">{{ region.name }}</span>
        </div>
        <span class="text-sm font-medium text-gray-800">{{ region.formattedValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  adData: {
    type: Object,
    default: undefined,
  },
})

const regions = computed(() => {
  const data = [
    { name: '中国大陆', value: props.adData?.trafficCfgChinamainland || 0, gradientFrom: '#3A82F9', gradientTo: '#A2C0FF' },
    { name: '中国台湾', value: props.adData?.trafficCfgChinataiwan || 0, gradientFrom: '#3A82F9', gradientTo: '#A2C0FF' },
    { name: '韩国', value: props.adData?.trafficCfgSouthkorea || 0, gradientFrom: '#00C8C1', gradientTo: '#58E9E3' },
    { name: '日本', value: props.adData?.trafficCfgJapan || 0, gradientFrom: '#F5B139', gradientTo: '#FBD985' },
    { name: '美国', value: props.adData?.trafficCfgUnitedstates || 0, gradientFrom: '#D93AF9', gradientTo: '#CDA2FF' },
    { name: '其他', value: props.adData?.trafficCfgOther || 0, gradientFrom: '#FF547C', gradientTo: '#FF92AB' },
  ].filter(item => item.value > 0)

  const maxValue = Math.max(...data.map(item => item.value), 1)

  return data.map(item => ({
    ...item,
    percentage: (item.value / maxValue) * 100,
    formattedValue: item.value.toLocaleString(),
  }))
})
</script>


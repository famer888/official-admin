<template>
  <div class="bg-white rounded-lg shadow-md p-6 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#CE80E8]">
    <div class="flex items-center gap-3 mb-6">
      <img src="@/assets/images/supermarket/detail8.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl" style="color: #455980">地区流量</p>
    </div>
    
    <div class="space-y-4">
      <div
        v-for="(region, index) in regions"
        :key="index"
        class="flex items-start gap-4"
      >
        <div class="flex-1">
          <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              class="h-2 rounded-full transition-all"
              :class="region.color"
              :style="{ width: region.percentage + '%' }"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-800">{{ region.formattedValue }}</span>
        </div>
        <span class="text-sm text-gray-700 w-20 flex-shrink-0 text-right">{{ region.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { AdTypeData } from '../types'

export default defineComponent({
  name: 'RegionalTrafficCard',
  props: {
    adData: {
      type: Object as () => AdTypeData | undefined,
      default: undefined,
    },
  },
  setup(props) {
    const regions = computed(() => {
      const data = [
        { name: '中国大陆', value: props.adData?.trafficCfgChinamainland || 0, color: 'bg-blue-500' },
        { name: '中国台湾', value: props.adData?.trafficCfgChinataiwan || 0, color: 'bg-blue-500' },
        { name: '韩国', value: props.adData?.trafficCfgSouthkorea || 0, color: 'bg-green-500' },
        { name: '日本', value: props.adData?.trafficCfgJapan || 0, color: 'bg-yellow-500' },
        { name: '美国', value: props.adData?.trafficCfgUnitedstates || 0, color: 'bg-purple-500' },
        { name: '其他', value: props.adData?.trafficCfgOther || 0, color: 'bg-red-500' },
      ].filter(item => item.value > 0)

      const maxValue = Math.max(...data.map(item => item.value), 1)

      return data.map(item => ({
        ...item,
        percentage: (item.value / maxValue) * 100,
        formattedValue: item.value.toLocaleString(),
      }))
    })

    return {
      regions,
    }
  },
})
</script>


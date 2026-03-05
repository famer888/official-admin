<template>
  <div class="bg-white rounded-lg p-6 relative h-full flex flex-col before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#5ABBB2]">
    <div class="flex items-center gap-3 mb-4">
      <img src="@/assets/images/supermarket/detail2.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl text-[#455980] font-['PingFang_SC',sans-serif] font-semibold">广告统计数据</p>
    </div>
    <p class="text-sm mb-6 text-[#86909C]">统计数据截止于{{ currentDate }}</p>

    <div class="grid grid-cols-2 gap-6">
      <div v-for="(column, colIndex) in chartColumns" :key="colIndex" class="space-y-4">
        <div class="flex flex-col items-center space-y-4">
          <div v-for="(chart, chartIndex) in column" :key="chartIndex" class="flex flex-col items-center">
            <div class="relative w-32 h-32">
              <svg class="transform -rotate-90" width="128" height="128">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#e5e7eb"
                  stroke-width="14"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  :stroke="chart.color"
                  stroke-width="14"
                  fill="none"
                  stroke-dasharray="326.73"
                  :stroke-dashoffset="getStrokeDashoffset(chart.percentage)"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span
                  class="font-bold"
                  :class="getRingValueFontClass(chart.displayValue)"
                  :style="{ color: chart.color }"
                >{{ formatDisplayNumber(chart.displayValue) }}</span>
              </div>
            </div>
            <h4 class="font-medium text-center mt-2 text-[#455980] text-lg">{{ chart.title }}</h4>
            <p class="text-[#455980] text-sm">{{ chart.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCurrentDate } from '@/utils/dateUtil'

const props = defineProps({
  adData: {
    type: Object,
    default: undefined,
  },
})

// 获取当前日期
const currentDate = computed(() => getCurrentDate())

// 计算圆形图的进度百分比（基于最大值）
const maxClicks = computed(() => {
  const optimal = props.adData?.optimalClicks || 0
  const average = props.adData?.averageClicks || 0
  return Math.max(optimal, average, 100)
})

const maxExposure = computed(() => {
  const optimal = props.adData?.optimalExposure || 0
  const average = props.adData?.averageExposure || 0
  return Math.max(optimal, average, 10000)
})

const optimalClicksPercentage = computed(() => {
  const value = props.adData?.optimalClicks || 0
  return Math.min((value / maxClicks.value) * 100, 100)
})

const averageClicksPercentage = computed(() => {
  const value = props.adData?.averageClicks || 0
  return Math.min((value / maxClicks.value) * 100, 100)
})

const optimalExposurePercentage = computed(() => {
  const value = props.adData?.optimalExposure || 0
  return Math.min((value / maxExposure.value) * 100, 100)
})

const averageExposurePercentage = computed(() => {
  const value = props.adData?.averageExposure || 0
  return Math.min((value / maxExposure.value) * 100, 100)
})

// 计算圆形图的 stroke-dashoffset
const circumference = 326.73 // 2 * π * 52
const getStrokeDashoffset = (percentage) => {
  return circumference - (circumference * percentage) / 100
}

/** 环形图中间数值的字号：数字越大字号越小，阶梯式（配置驱动，易扩展） */
const RING_FONT_TIERS = [
  [100, 'text-4xl'],
  [1e3, 'text-3xl'],
  [1e4, 'text-2xl'],
  [1e5, 'text-xl'],
  [1e6, 'text-lg'],
  [1e7, 'text-base'],
  [1e8, 'text-sm'],
  [Infinity, 'text-xs'],
]
const getRingValueFontClass = (value) => {
  const num = Number(value) || 0
  return RING_FONT_TIERS.find(([max]) => num < max)[1]
}

/**
 * 环形图数值展示：少于 1 万正常显示，达到 1 万及以上用 W 单位，保留 2 位小数
 * @param {number} value - 原始数值
 * @returns {string} 如 9999 -> "9999", 10000 -> "1W", 6262626 -> "626.26W"
 */
const formatDisplayNumber = (value) => {
  const num = Number(value)
  if (num === 0 || Number.isNaN(num)) return '0'
  if (num < 10000) return String(num)
  const intPart = Math.floor(num / 10000)
  const remainder = num % 10000
  if (remainder === 0) return `${intPart}W`
  const fracStr = String(remainder).padStart(4, '0').slice(0, 2).replace(/0+$/, '') || '0'
  return `${intPart}.${fracStr}W`
}

const formatExposureWithUnit = (value) => {
  if (!value) return '0/日'
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}万/日`
  }
  return `${value}/日`
}

const chartColumns = computed(() => {
  return [
    [
      {
        color: '#5C91E8',
        fontSize: '2.5rem',
        title: '点击量',
        description: `最佳: ${props.adData?.optimalClicks || 0}次/日`,
        displayValue: props.adData?.optimalClicks || 0,
        percentage: optimalClicksPercentage.value,
      },
      {
        color: '#EB5F80',
        fontSize: '1.75rem',
        title: '曝光量',
        description: `最佳: ${formatExposureWithUnit(props.adData?.optimalExposure || 0)}`,
        displayValue: props.adData?.optimalExposure ?? 0,
        percentage: optimalExposurePercentage.value,
      },
    ],
    [
      {
        color: '#D660ED',
        fontSize: '2.5rem',
        title: '点击量',
        description: `平均: ${props.adData?.averageClicks || 0}次/日`,
        displayValue: props.adData?.averageClicks || 0,
        percentage: averageClicksPercentage.value,
      },
      {
        color: '#69DDD9',
        fontSize: '1.75rem',
        title: '曝光量',
        description: `平均: ${formatExposureWithUnit(props.adData?.averageExposure || 0)}`,
        displayValue: props.adData?.averageExposure ?? 0,
        percentage: averageExposurePercentage.value,
      },
    ],
  ]
})
</script>


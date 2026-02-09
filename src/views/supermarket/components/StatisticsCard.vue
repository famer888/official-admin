<template>
  <div class="bg-white rounded-lg shadow-md p-6 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#5ABBB2]">
    <div class="flex items-center gap-3 mb-4">
      <img src="@/assets/images/supermarket/detail2.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl" style="color: #455980">广告统计数据</p>
    </div>
    <p class="text-sm mb-6" style="color: #86909C">统计数据截止于2026-11-21</p>

    <div class="grid grid-cols-2 gap-6">
      <!-- 点击量 -->
      <div class="space-y-4">
        <div class="flex flex-col items-center space-y-4">
          <!-- 最佳点击量 -->
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24">
              <svg class="transform -rotate-90" width="96" height="96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#3b82f6"
                  stroke-width="8"
                  fill="none"
                  stroke-dasharray="251.2"
                  :stroke-dashoffset="getStrokeDashoffset(optimalClicksPercentage)"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl font-bold text-gray-800">{{ adData?.optimalClicks || 0 }}</span>
              </div>
            </div>
            <h4 class="text-sm font-medium text-center mt-2" style="color: #455980">点击量</h4>
            <p class="text-xs" style="color: #455980">最佳: {{ adData?.optimalClicks || 0 }}次/日</p>
          </div>
            <!-- 最佳曝光量 -->
          <div class="flex flex-col items-center">
            <div class="relative w-24 h-24">
              <svg class="transform -rotate-90" width="96" height="96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#ef4444"
                  stroke-width="8"
                  fill="none"
                  stroke-dasharray="251.2"
                  :stroke-dashoffset="getStrokeDashoffset(optimalExposurePercentage)"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-sm font-bold text-gray-800">{{ formatExposure(adData?.optimalExposure || 0) }}</span>
              </div>
            </div>
            <h4 class="text-sm font-medium text-center mt-2" style="color: #455980">曝光量</h4>
            <p class="text-xs" style="color: #455980">最佳: {{ formatExposureWithUnit(adData?.optimalExposure || 0) }}</p>
          </div>
         
        </div>
      </div>

      <!-- 曝光量 -->
      <div class="space-y-4">
        <div class="flex flex-col items-center space-y-4">
            <!-- 平均点击量 -->
            <div class="flex flex-col items-center">
            <div class="relative w-24 h-24">
              <svg class="transform -rotate-90" width="96" height="96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#a855f7"
                  stroke-width="8"
                  fill="none"
                  stroke-dasharray="251.2"
                  :stroke-dashoffset="getStrokeDashoffset(averageClicksPercentage)"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xl font-bold text-gray-800">{{ adData?.averageClicks || 0 }}</span>
              </div>
            </div>
            <h4 class="text-sm font-medium text-center mt-2" style="color: #455980">点击量</h4>
            <p class="text-xs" style="color: #455980">平均: {{ adData?.averageClicks || 0 }}次/日</p>
          </div>
         <!-- 平均曝光量 -->
         <div class="flex flex-col items-center">
            <div class="relative w-24 h-24">
              <svg class="transform -rotate-90" width="96" height="96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#10b981"
                  stroke-width="8"
                  fill="none"
                  stroke-dasharray="251.2"
                  :stroke-dashoffset="getStrokeDashoffset(averageExposurePercentage)"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-sm font-bold text-gray-800">{{ formatExposure(adData?.averageExposure || 0) }}</span>
              </div>
            </div>
            <h4 class="text-sm font-medium text-center mt-2" style="color: #455980">曝光量</h4>
            <p class="text-xs" style="color: #455980">平均: {{ formatExposureWithUnit(adData?.averageExposure || 0) }}</p>
          </div>

        
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { AdTypeData } from '../types'

export default defineComponent({
  name: 'StatisticsCard',
  props: {
    adData: {
      type: Object as () => AdTypeData | undefined,
      default: undefined,
    },
  },
  setup(props) {
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
    const circumference = 251.2 // 2 * π * 40
    const getStrokeDashoffset = (percentage: number) => {
      return circumference - (circumference * percentage) / 100
    }

    const formatExposure = (value: number) => {
      if (value >= 10000) {
        return `${(value / 10000).toFixed(0)} W`
      }
      return value.toString()
    }

    const formatExposureWithUnit = (value: number) => {
      if (!value) return '0/日'
      if (value >= 10000) {
        return `${(value / 10000).toFixed(0)}万/日`
      }
      return `${value}/日`
    }

    return {
      optimalClicksPercentage,
      averageClicksPercentage,
      optimalExposurePercentage,
      averageExposurePercentage,
      getStrokeDashoffset,
      formatExposure,
      formatExposureWithUnit,
    }
  },
})
</script>


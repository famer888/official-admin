<template>
  <div class="bg-white rounded-lg shadow-md p-6 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#DABF37]">
    <div class="flex items-center gap-3 mb-6">
      <img src="@/assets/images/supermarket/detail3.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl" style="color: #455980">流量来源</p>
    </div>
    
    <div>
      <!-- 环形图 -->
      <div ref="chartRef" class="w-full h-96"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, nextTick } from 'vue'
import type { AdTypeData } from '../types'
import { useECharts } from '@/hooks/web/useECharts'
import type { EChartsOption } from 'echarts'

export default defineComponent({
  name: 'TrafficSourceCard',
  props: {
    adData: {
      type: Object as () => AdTypeData | undefined,
      default: undefined,
    },
  },
  setup(props) {
    const chartRef = ref<HTMLDivElement>()
    const { setOptions } = useECharts(chartRef as any)

    const trafficSources = computed(() => {
      const chrome = props.adData?.trafficSourceChrome || 0
      const ie = props.adData?.trafficSourceIe || 0
      const firefox = props.adData?.trafficSourceFirefox || 0
      const safari = props.adData?.trafficSourceSafari || 0
      const browser360 = props.adData?.trafficSource360safebrowser || 0
      const sogou = props.adData?.trafficSourceSogouexplorer || 0
      const yandex = props.adData?.trafficSourceYandexbrowser || 0
      const silk = props.adData?.trafficSourceSilk || 0
      const other = props.adData?.trafficSourceOther || 0

      return [
        { name: 'Chrome', value: chrome, color: '#ef4444' },
        { name: 'IE', value: ie, color: '#f97316' },
        { name: 'Firefox', value: firefox, color: '#10b981' },
        { name: 'Safari', value: safari, color: '#06b6d4' },
        { name: '360安全浏览器', value: browser360, color: '#eab308' },
        { name: '搜狗浏览器', value: sogou, color: '#8b5cf6' },
        { name: 'Yandex', value: yandex, color: '#ec4899' },
        { name: 'Silk', value: silk, color: '#14b8a6' },
        { name: '其他', value: other, color: '#64748b' },
      ].filter(item => item.value > 0)
    })

    const total = computed(() => {
      return trafficSources.value.reduce((sum, item) => sum + item.value, 0)
    })

    const initChart = () => {
      if (!chartRef.value || trafficSources.value.length === 0) return

      const chartData = trafficSources.value.map((item) => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          color: item.color,
        },
      }))

      const option: EChartsOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          top: 'center',
          itemGap: 12,
          textStyle: {
            color: '#666',
            fontSize: 12,
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 0,
              borderColor: '#fff',
              borderWidth: 0,
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{d}%',
              fontSize: 14,
              fontWeight: 'bold',
              color: '#fff',
            },
            labelLine: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
              },
            },
            data: chartData,
          },
        ],
      }

      setOptions(option)
    }

    watch(
      () => trafficSources.value,
      () => {
        nextTick(() => {
          initChart()
        })
      },
      { deep: true, immediate: true }
    )

    onMounted(() => {
      nextTick(() => {
        initChart()
      })
    })

    return {
      chartRef,
      trafficSources,
      total,
    }
  },
})
</script>


<template>
  <div class="bg-white rounded-lg p-6 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#DABF37]">
    <div class="flex items-center gap-3 mb-6">
      <img src="@/assets/images/supermarket/detail3.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl text-[#455980] font-['PingFang_SC',sans-serif] font-semibold">流量来源</p>
    </div>
    
    <div>
      <!-- 环形图 -->
      <div ref="chartRef" class="w-full h-96"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useECharts } from '@/hooks/web/useECharts'

const props = defineProps({
  adData: {
    type: Object,
    default: undefined,
  },
})

const chartRef = ref()
const { setOptions, getInstance } = useECharts(chartRef)

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

const getChartOption = (containerWidth) => {
  const chartData = trafficSources.value.map((item) => ({
    value: item.value,
    name: item.name,
    itemStyle: {
      color: item.color,
    },
  }))

  // 根据容器宽度动态调整布局
  // 提高阈值，让图例更早切换为上下布局，避免重叠
  const isNarrow = containerWidth < 500
  const legendFontSize = isNarrow ? 10 : 12
  const labelFontSize = isNarrow ? 11 : 14

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: isNarrow ? 'horizontal' : 'vertical',
      right: isNarrow ? 'auto' : '8%',
      left: isNarrow ? '5%' : 'auto',
      top: isNarrow ? 'bottom' : 'center',
      bottom: isNarrow ? '5%' : 'auto',
      width: isNarrow ? '90%' : 'auto',
      itemGap: isNarrow ? 12 : 10,
      textStyle: {
        color: '#666',
        fontSize: legendFontSize,
      },
    },
    series: [
      {
        type: 'pie',
        radius: isNarrow ? ['35%', '60%'] : ['40%', '65%'],
        center: isNarrow ? ['50%', '40%'] : ['32%', '50%'],
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
          fontSize: labelFontSize,
          fontWeight: 'bold',
          color: '#fff',
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: labelFontSize + 2,
            fontWeight: 'bold',
          },
        },
        data: chartData,
      },
    ],
  }
}

const initChart = () => {
  if (!chartRef.value || trafficSources.value.length === 0) return

  const containerWidth = chartRef.value.clientWidth
  const option = getChartOption(containerWidth)
  setOptions(option)
}

const handleResize = () => {
  nextTick(() => {
    if (chartRef.value) {
      const containerWidth = chartRef.value.clientWidth
      const option = getChartOption(containerWidth)
      setOptions(option)
      const instance = getInstance()
      if (instance) {
        instance.resize()
      }
    }
  })
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
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>


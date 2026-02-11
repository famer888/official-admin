<template>
  <div class="fixed top-[64px] right-0 bottom-0 z-50 bg-[#F9FAFC] overflow-auto flex flex-col" :style="modalStyle">
    <div class="w-full p-4 lg:p-6 flex-1 flex flex-col">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <n-button quaternary @click="handleClose">
          <template #icon>
            <n-icon><LeftOutlined /></n-icon>
          </template>
          返回
        </n-button>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch flex-1">
        <!-- 第一列：广告详情卡片 -->
        <div class="lg:col-span-1 flex">
          <AdDetailCard :ad-data="adDataWithImage" class="w-full h-full" />
        </div>

        <!-- 第二列：统计数据 -->
        <div class="lg:col-span-1 flex">
          <StatisticsCard :ad-data="adData" class="w-full h-full" />
        </div>

        <!-- 第三列：流量来源和地区流量 -->
        <div class="lg:col-span-1 space-y-6">
          <TrafficSourceCard :ad-data="adData" />
          <RegionalTrafficCard :ad-data="adData" />
        </div>

        <!-- 第四列：价格 -->
        <div class="lg:col-span-1 flex">
          <PriceCard :ad-data="adData" class="w-full h-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { LeftOutlined } from '@vicons/antd'
import AdDetailCard from './AdDetailCard.vue'
import StatisticsCard from './StatisticsCard.vue'
import TrafficSourceCard from './TrafficSourceCard.vue'
import PriceCard from './PriceCard.vue'
import RegionalTrafficCard from './RegionalTrafficCard.vue'
import type { AdTypeData } from '../types'
import { useGlobSetting } from '@/hooks/setting'

const props = defineProps<{
  adData: AdTypeData
}>()

const emit = defineEmits<{
  close: []
}>()

const { showUrl } = useGlobSetting()

const adDataWithImage = computed(() => {
  return {
    ...props.adData,
    image: props.adData.exampleUrl ? `${showUrl || ''}${props.adData.exampleUrl}` : undefined,
  }
})

const handleClose = () => {
  emit('close')
}

// 计算左侧菜单宽度
const leftMenuWidth = ref(0)

const calculateLeftWidth = () => {
  const sider = document.querySelector('.layout-sider')
  if (sider) {
    const rect = sider.getBoundingClientRect()
    leftMenuWidth.value = rect.width
  } else {
    leftMenuWidth.value = 0
  }
}

const modalStyle = computed(() => {
  return {
    left: `${leftMenuWidth.value}px`,
  }
})

onMounted(() => {
  calculateLeftWidth()
  window.addEventListener('resize', calculateLeftWidth)
  // 监听侧边栏变化
  const observer = new MutationObserver(calculateLeftWidth)
  const layout = document.querySelector('.layout')
  if (layout) {
    observer.observe(layout, { attributes: true, childList: true, subtree: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateLeftWidth)
})
</script>


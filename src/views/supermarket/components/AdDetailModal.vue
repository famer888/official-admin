<template>
  <div class="fixed inset-0 z-50 bg-[#F9FAFC] overflow-hidden h-screen">
    <div class="w-full p-4 lg:p-6">
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
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 第一列：广告详情卡片 -->
        <div class="lg:col-span-1">
          <AdDetailCard :ad-data="adDataWithImage" />
        </div>

        <!-- 第二列：统计数据 -->
        <div class="lg:col-span-1">
          <StatisticsCard :ad-data="adData" />
        </div>

        <!-- 第三列：流量来源和地区流量 -->
        <div class="lg:col-span-1 space-y-6">
          <TrafficSourceCard :ad-data="adData" />
          <RegionalTrafficCard :ad-data="adData" />
        </div>

        <!-- 第四列：价格 -->
        <div class="lg:col-span-1">
          <PriceCard :ad-data="adData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { LeftOutlined } from '@vicons/antd'
import AdDetailCard from './AdDetailCard.vue'
import StatisticsCard from './StatisticsCard.vue'
import TrafficSourceCard from './TrafficSourceCard.vue'
import PriceCard from './PriceCard.vue'
import RegionalTrafficCard from './RegionalTrafficCard.vue'
import type { AdTypeData } from '../types'
import { useGlobSetting } from '@/hooks/setting'

export default defineComponent({
  name: 'AdDetailModal',
  components: {
    NButton,
    NIcon,
    LeftOutlined,
    AdDetailCard,
    StatisticsCard,
    TrafficSourceCard,
    PriceCard,
    RegionalTrafficCard,
  },
  props: {
    adData: {
      type: Object as () => AdTypeData,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
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

    return {
      adData: props.adData,
      adDataWithImage,
      handleClose,
    }
  },
})
</script>


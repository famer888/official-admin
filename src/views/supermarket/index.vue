<template>
 <div class="h-full w-full bg-red p-4 lg:p-6 -m-[10px] overflow-hidden relative" >
    <!-- 详情弹窗 -->
    <AdDetailModal
      v-if="selectedAdData"
      :ad-data="selectedAdData"
      @close="selectedAdData = null"
    />

    <!-- 顶部横幅 -->
    <div
      class="rounded-lg py-6 px-5 lg:py-8 lg:px-10 mb-6 relative overflow-hidden before:content-[''] before:absolute before:right-0 before:top-0 before:w-[300px] before:h-full before:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%27200%27%20height%3D%27200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cdefs%3E%3Cpattern%20id%3D%27grid%27%20width%3D%2740%27%20height%3D%2740%27%20patternUnits%3D%27userSpaceOnUse%27%3E%3Cpath%20d%3D%27M%2040%200%20L%200%200%200%2040%27%20fill%3D%27none%27%20stroke%3D%27rgba(255%2C255%2C255%2C0.1)%27%20stroke-width%3D%271%27%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20fill%3D%27url(%23grid)%27%20%2F%3E%3C%2Fsvg%3E')] before:bg-cover before:opacity-30"
      :style="backgroundStyle"
    >
      <div class="relative z-10 w-[60%] mx-auto">
        <p class="text-white text-[26px] lg:text-[28px] leading-relaxed m-0 text-center font-medium">
          打造APP全场景变现能力 提升您品牌价值的同时 触达您的潜在客户达成您满意的投放效果
        </p>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="flex flex-col gap-5">
      <!-- 标题 -->
      <div class="pt-2">
        <h2 class="text-xl lg:text-2xl font-semibold text-gray-800 m-0 text-left">广告类型</h2>
      </div>

      <!-- 广告卡片网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 md:gap-6 w-full">
        <AdTypeCard
          v-for="adType in adTypesData"
          :key="adType.id"
          :ad-data="adType"
          @buy="handleBuy"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import AdTypeCard from './components/AdTypeCard.vue'
import AdDetailModal from './components/AdDetailModal.vue'
import type { AdTypeData } from './types'
import { getAdvertiseSupermarketPage } from '@/api/common'
import { useGlobSetting } from '@/hooks/setting'
import market6Icon from '@/assets/images/supermarket/market6.svg'

export default defineComponent({
  name: 'AdTypesPage',
  components: {
    AdTypeCard,
    AdDetailModal,
  },
  setup() {
    const selectedAdData = ref<AdTypeData | null>(null)
    const adTypesData = ref<AdTypeData[]>([])
    const { showUrl } = useGlobSetting()

    const handleBuy = (adData: AdTypeData) => {
      selectedAdData.value = adData
    }

    // 调用接口获取数据
    onMounted(async () => {
      try {
        const res: any = await getAdvertiseSupermarketPage({ 
          pageNum: 1, 
          pageSize: 10 
        })
        console.log('广告超市配置列表数据:', res)
        
        if (res?.data?.dataList) {
          // 将接口返回的数据映射为组件需要的数据格式
          adTypesData.value = res.data.dataList.map((item: any) => ({
            id: item.id?.toString() || '',
            title: item.displayScenario || '',
            description: item.advertiseDesc || '',
            image: item.exampleUrl ? `${showUrl || ''}${item.exampleUrl}` : undefined,
            buttonType: 'primary' as const,
            buttonGhost: false,
            // 保留原始数据，供详情页使用
            ...item,
          }))
        }
      } catch (error) {
        console.error('获取广告超市配置列表失败:', error)
      }
    })

    // 背景图样式
    const backgroundStyle = {
      backgroundImage: `url(${market6Icon})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: 'calc(100% + 30px)'
    }

    return {
      adTypesData,
      handleBuy,
      market6Icon,
      backgroundStyle,
      selectedAdData,
    }
  },
})
</script>


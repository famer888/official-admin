<template>
 <div class="h-full w-full bg-red p-4 lg:p-6 -m-[10px] overflow-hidden relative">
    <!-- 详情弹窗 -->
    <AdDetailModal
      v-if="selectedAdData"
      :ad-data="selectedAdData"
      @close="selectedAdData = null"
    />

    <!-- 顶部横幅 -->
    <div
      :class="['rounded-lg py-6 px-5 lg:py-8 lg:px-10 mb-6 relative overflow-hidden before:content-[\'\'] before:absolute before:right-0 before:top-0 before:w-[300px] before:h-full', beforeBgClass, 'before:bg-cover before:opacity-30']"
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
        <h2 class="text-xl lg:text-2xl font-semibold text-[#455980] m-0 text-left">广告类型</h2>
      </div>

      <!-- 广告卡片网格 -->
      <div class="grid grid-cols-3 w-full" style="column-gap: 1.36%; row-gap: 9%;">
        <AdTypeCard
          v-for="adType in adTypesData"
          :key="adType.id"
          :ad-data="adType"
          @buy="handleBuy"
        />
      </div>
    </div>

    <!-- 分页组件 - 固定在右下角 -->
    <div class="fixed bottom-6 right-6 z-10">
      <n-pagination
        v-model:page="pagination.page"
        :page-size="pagination.pageSize"
        :item-count="pagination.itemCount"
        :show-size-picker="false"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { NPagination } from 'naive-ui'
import AdTypeCard from './components/AdTypeCard.vue'
import AdDetailModal from './components/AdDetailModal.vue'
import type { AdTypeData } from './types'
import { getAdvertiseSupermarketPage } from '@/api/common'
import { useGlobSetting } from '@/hooks/setting'
import market6Icon from '@/assets/images/supermarket/market6.svg'

const selectedAdData = ref<AdTypeData | null>(null)
const adTypesData = ref<AdTypeData[]>([])
const { showUrl } = useGlobSetting()

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 6,
  itemCount: 0,
})

const handleBuy = (adData: AdTypeData) => {
  selectedAdData.value = adData
}

// 获取广告超市配置列表
const fetchAdTypesData = async (pageNo: number = 1) => {
  try {
    const res: any = await getAdvertiseSupermarketPage({ 
      pageNo, 
      pageSize: pagination.pageSize 
    })
    if (res?.data) {
      // 更新分页信息
      pagination.itemCount = res.data.total || 0
      pagination.page = pageNo
      
      // 将接口返回的数据映射为组件需要的数据格式
      if (res.data.dataList) {
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
      } else {
        adTypesData.value = []
      }
    }
  } catch (error) {
    console.error('获取广告超市配置列表失败:', error)
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  fetchAdTypesData(page)
}

// 调用接口获取数据
onMounted(() => {
  fetchAdTypesData(1)
})

// 背景图样式
const backgroundStyle = {
  backgroundImage: `url(${market6Icon})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: 'calc(100% + 30px)'
}

// 计算 before 伪元素的背景图 class
const beforeBgClass = computed(() => {
  return `before:bg-[url('${market6Icon}')]`
})
</script>


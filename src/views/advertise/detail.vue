<template>
  <div class="min-h-full p-2.5">
    <AdBreadcrumb current-title="广告计划详情" @back="router.push('/advertise/plan')" />

    <div class="p-5 bg-white rounded-lg">
      <div class="flex items-center mb-6">
        <span class="text-base leading-4 font-medium text-[#455980] mr-3 whitespace-nowrap">
          广告计划名称
        </span>
        <span class="text-base leading-4 font-semibold text-[#3A82F9]">
          {{ detailData.planName }}
        </span>
      </div>

      <div class="mb-10">
        <div class="text-base leading-4 font-medium text-[#455980] mb-4">投放位置</div>
        <div class="flex flex-wrap gap-5">
          <AdPositionCard
            v-for="(pos, index) in detailData.positions"
            :key="index"
            :position="pos"
            :index="index"
          />
        </div>
      </div>

      <div class="mb-[146px]">
        <div class="text-base leading-4 font-medium text-[#455980] mb-4">广告创意</div>
        <div class="flex flex-wrap gap-6">
          <AdCreativeCard
            v-for="(creative, index) in detailData.creatives"
            :key="index"
            :creative="creative"
            :index="index"
          />
        </div>
      </div>

      <div class="flex items-center gap-5 mt-9">
        <n-button
          color="#F4F5F9"
          text-color="#3A82F9"
          class="!w-[200px] !h-[48px] !rounded !font-medium !text-base"
          @click="router.push('/advertise/plan')"
        >
          关闭
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import AdBreadcrumb from './components/AdBreadcrumb.vue'
  import AdPositionCard from './components/AdPositionCard.vue'
  import AdCreativeCard from './components/AdCreativeCard.vue'

  defineOptions({ name: 'AdvertiseDetail' })

  const router = useRouter()
  const route = useRoute()

  const detailData = reactive({
    planName: '1月-万象APP活跃用户福利',
    positions: [
      {
        adSlot: '万象-商户-Y02-T02-长/短视/动漫贴片广告',
        dateRange: '2026.01.26-2026.01.28.2026.02.04',
        budget: 20000,
      },
      {
        adSlot: '万象-商户-Y02-T02-长/短视/动漫贴片广告',
        dateRange: '2026.01.26-2026.01.28.2026.02.04',
        budget: 20000,
      },
    ],
    creatives: [
      {
        title: '万象-商户-Y02-T02-长/短视频/动漫贴片广告 APP-尺寸 [152*$59]',
        imageUrl: '',
        ratio: '359:152',
        link: '',
      },
      {
        title: '万象-商户-Y02-T02-长/短视频/动漫贴片广告 APP-尺寸 [152*$59]',
        imageUrl: '',
        ratio: '4:3',
        link: 'https://xxxxxxxxx.com',
      },
    ],
  })

  if (route.query.planName) {
    detailData.planName = route.query.planName
  }
</script>

<template>
  <div class="min-h-full">
    <div class="flex items-center gap-1 text-sm mb-4">
      <span
        class="text-[#333] cursor-pointer hover:text-[#3A82F9]"
        @click="router.push('/advertise/plan')"
      >
        广告管理
      </span>
      <span class="text-[#999]">/</span>
      <span class="text-[#3A82F9]">编辑广告计划</span>
    </div>

    <div class="p-6 bg-white rounded-[8px]">
      <div class="flex items-center mb-6">
        <span class="text-sm text-[#333] mr-2 whitespace-nowrap">广告计划名称</span>
        <span class="text-sm text-[#3A82F9] font-medium">{{ detailData.planName }}</span>
      </div>

      <div class="mb-6">
        <div class="text-sm text-[#333] font-medium mb-4">投放位置</div>
        <div class="flex flex-wrap gap-6">
          <div
            v-for="(pos, index) in detailData.positions"
            :key="index"
            class="flex-1 min-w-[300px]"
          >
            <div class="text-sm font-medium text-[#333] mb-2">位置{{ index + 1 }}</div>
            <div class="text-sm text-[#666] leading-7">
              <div>
                <span class="text-[#999]">广告位：</span>{{ pos.adSlot }}
              </div>
              <div>
                <span class="text-[#999]">投放日期：</span>{{ pos.dateRange }}
              </div>
              <div>
                <span class="text-[#999]">投放预算：</span>{{ pos.budget }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <div class="text-sm text-[#333] font-medium mb-4">广告创意</div>
        <div class="flex flex-wrap gap-6">
          <div
            v-for="(creative, index) in detailData.creatives"
            :key="index"
            class="flex-1 min-w-[300px]"
          >
            <div class="text-sm font-medium text-[#333] mb-3">
              素材{{ index + 1 }}：{{ creative.title }}
            </div>
            <div class="flex gap-4">
              <div
                class="w-[120px] h-[120px] rounded-[8px] overflow-hidden bg-[#F4F5F9] flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="creative.imageUrl"
                  :src="creative.imageUrl"
                  alt="素材预览"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-xs text-[#999]">暂无图片</span>
              </div>
              <ul class="text-xs text-[#666] leading-6 list-disc pl-4">
                <li>支持上传jpg、png、webp 格式的文件</li>
                <li>限制上传文件大小5M</li>
                <li>限制图片的尺寸比例为 【{{ creative.ratio }}】</li>
              </ul>
            </div>
            <div class="text-sm text-[#666] mt-3">
              <span class="text-[#999]">跳转连接</span>
              <span class="ml-3">{{ creative.link || '无' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <n-button
          class="!w-[200px] !h-[48px] !rounded-[4px]"
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

  defineOptions({
    name: 'AdvertiseDetail',
  })

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

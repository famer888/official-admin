<template>
  <div class="min-h-full p-2.5">
    <div class="flex items-center gap-3 text-sm mb-5">
      <span
        class="text-[#1D2129] text-base cursor-pointer hover:text-[#3A82F9] font-medium"
        @click="router.push('/advertise/plan')"
      >
        广告管理
      </span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.3535 0.353516L0.353516 11.3535" stroke="#3A82F9" />
      </svg>
      <span class="text-[#3A82F9] text-base">广告计划详情</span>
    </div>

    <div class="p-5 bg-white rounded-[8px]">
      <div class="flex items-center mb-6">
        <span class="detail-section-label mr-3 whitespace-nowrap">广告计划名称</span>
        <span class="detail-plan-name">{{ detailData.planName }}</span>
      </div>

      <div class="mb-10">
        <div class="detail-section-label mb-4">投放位置</div>
        <div class="flex flex-wrap gap-5">
          <div
            v-for="(pos, index) in detailData.positions"
            :key="index"
            class="flex-1 !bg-[#F4F5F9] !p-2"
          >
            <div class="detail-section-label mb-[10px]">位置{{ index + 1 }}</div>
            <div class="detail-position-info">
              <div><span>广告位：</span>{{ pos.adSlot }}</div>
              <div><span>投放日期：</span>{{ pos.dateRange }}</div>
              <div><span>投放预算：</span>{{ pos.budget }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-[146px]">
        <div class="detail-section-label mb-4">广告创意</div>
        <div class="flex flex-wrap gap-6">
          <div
            v-for="(creative, index) in detailData.creatives"
            :key="index"
            class="flex-1 !bg-[#F4F5F9] !p-4 flex flex-col gap-4"
          >
            <div class="detail-creative-title"> 素材{{ index + 1 }}：{{ creative.title }} </div>
            <div class="flex gap-4">
              <div
                class="w-[130px] h-[130px] rounded-[16px] overflow-hidden !bg-[#FFFFFF] flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="creative.imageUrl"
                  :src="creative.imageUrl"
                  alt="素材预览"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-xs text-[#999]">暂无图片</span>
              </div>
              <ul class="detail-creative-tips list-disc pl-4">
                <li>支持上传jpg、png、webp 格式的文件</li>
                <li>限制上传文件大小5M</li>
                <li>限制图片的尺寸比例为 【{{ creative.ratio }}】</li>
              </ul>
            </div>
            <div class="flex items-center justify-start gap-3 w-full">
              <span class="detail-link-label">跳转连接</span>
              <span class="bg-white flex-1 py-[11px] px-3 rounded-[4px] text-sm">
                <span v-if="creative.link" class="text-[#1D2129]">{{ creative.link }}</span>
                <span v-else class="text-[#86909C]">无</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-5 mt-9">
        <n-button
          type="secondary"
          class="btn-cancel !w-[200px] !h-[48px] !rounded-[4px] font-medium"
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

<style scoped>
  .detail-section-label {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0;
    color: #455980;
  }

  .detail-plan-name {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0;
    text-align: center;
    color: #3a82f9;
  }

  .detail-position-info > div {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0;
    color: #86909c;
  }

  .detail-position-info > div span {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0;
    color: #455980;
  }

  .detail-creative-title {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0;
    color: #000000;
  }

  .detail-creative-tips {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0;
    color: #455980;
  }

  .detail-link-label {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0;
    text-align: center;
    color: #1d2129;
    min-width: 1px;
  }

  .btn-cancel {
    border: 1px solid #f4f5f9 !important;
    box-shadow: none;
    background: #f4f5f9 !important;
    color: #3a82f9 !important;
    font-weight: 500 !important;
    font-size: 16px !important;
    line-height: 16px !important;
    text-align: center !important;
    outline: none !important;
  }
</style>

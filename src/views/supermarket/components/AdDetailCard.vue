<template>
  <div class="bg-white rounded-lg shadow-md p-6 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#6389E1]">
    <div class="flex items-center gap-3 mb-6">
      <img src="@/assets/images/supermarket/detail1.svg" alt="icon" class="w-7 h-7" />
      <p class="text-2xl" style="color: #455980">{{ adData?.displayScenario || adData?.title }}</p>
    </div>
    <!-- 手机预览图 -->
    <div class="mb-6 flex justify-center">
      <img
        v-if="adData?.image"
        :src="adData.image"
        :alt="adData.title"
        class="w-1/2 h-auto object-cover"
      />
    </div>

    <!-- 广告信息 -->
    <div class="space-y-4">
      <div class="flex items-start gap-4">
        <h3 class="text-lg font-semibold flex-shrink-0" style="color: #455980">广告类型:</h3>
        <p style="color: #86909C">{{ adData?.displayScenario || adData?.title }}</p>
      </div>

      <div class="flex items-start gap-4" v-if="adData?.advertiseDesc">
        <p class="text-sm leading-relaxed" style="color: #86909C">{{ adData.advertiseDesc }}</p>
      </div>

      <div class="flex items-start gap-4">
        <h3 class="text-lg font-semibold flex-shrink-0" style="color: #455980">展示场景:</h3>
        <p class="text-sm" style="color: #86909C">{{ adData?.displayScenario || '所有应用的启动页' }}</p>
      </div>

      <div class="flex items-start gap-4">
        <h3 class="text-lg font-semibold flex-shrink-0" style="color: #455980">支持格式:</h3>
        <p class="text-sm" style="color: #86909C">{{ adData?.fileFormat || 'jpg、JPEG、PNG等静态图片' }}</p>
      </div>

      <div class="flex items-start gap-4">
        <h3 class="text-lg font-semibold flex-shrink-0" style="color: #455980">样式尺寸:</h3>
        <p class="text-sm" style="color: #86909C">{{ adData?.styleSizeDesc  }}</p>
      </div>

      <div class="flex items-start gap-4">
        <h3 class="text-lg font-semibold flex-shrink-0" style="color: #455980">预估曝光量:</h3>
        <p class="text-sm" style="color: #86909C">{{ adData?.estimatedExposure ? `${(adData.estimatedExposure / 10000).toFixed(0)}万/日` : '0万/日' }}</p>
      </div>

      <div class="flex items-start gap-4">
        <h3 class="text-lg font-semibold flex-shrink-0" style="color: #455980">模式:</h3>
        <p class="text-sm" style="color: #86909C">{{ adData?.adMode  }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { AdTypeData } from '../types'

export default defineComponent({
  name: 'AdDetailCard',
  props: {
    adData: {
      type: Object as () => AdTypeData | undefined,
      default: undefined,
    },
  },
})
</script>


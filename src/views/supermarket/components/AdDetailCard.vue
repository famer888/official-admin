<template>
  <div class="bg-white rounded-lg p-6 relative h-full flex flex-col before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[30%] before:h-[4px] before:bg-[#6389E1]">
    <div class="flex items-center gap-3 mb-6">
      <img src="@/assets/images/supermarket/detail1.svg" alt="icon" class="w-7 h-7" />
      <p class="text-[#455980] font-['PingFang_SC',sans-serif] text-2xl font-semibold">{{ adData?.advertiseName || adData?.title }}</p>
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
    <div class="space-y-2">
      <template v-for="(field, index) in infoFields" :key="index">
        <div v-if="field.show" class="flex items-center gap-4">
          <span v-if="field.label" class="flex-shrink-0 text-[#455980] font-['PingFang_SC',sans-serif] text-base font-[500]">{{ field.label }} :</span>
          <span class="text-[#86909C] font-['PingFang_SC',sans-serif] text-base font-[400]">{{ field.value }}</span>
      </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    adData: {
    type: Object,
      default: undefined,
    },
})

const infoFields = computed(() => {
  return [
    {
      label: '广告类型',
      value: props.adData?.advertiseName || props.adData?.title || '',
      show: true,
      valueClass: '',
    },
    {
      label: '',
      value: props.adData?.advertiseDesc || '',
      show: !!props.adData?.advertiseDesc,
      valueClass: 'text-sm leading-relaxed',
    },
    {
      label: '展示场景',
      value: props.adData?.displayScenario || '所有应用的启动页',
      show: true,
      valueClass: 'text-sm',
    },
    {
      label: '支持格式',
      value: props.adData?.fileFormat || 'jpg、JPEG、PNG等静态图片',
      show: true,
      valueClass: 'text-sm',
    },
    {
      label: '样式尺寸',
      value: props.adData?.styleSizeDesc || '',
      show: true,
      valueClass: 'text-sm',
    },
    {
      label: '预估曝光量',
      value: props.adData?.estimatedExposure ? `${(props.adData.estimatedExposure / 10000).toFixed(0)}万/日` : '0万/日',
      show: true,
      valueClass: 'text-sm',
    },
    {
      label: '模式',
      value: props.adData?.adMode || '',
      show: true,
      valueClass: 'text-sm',
    },
  ]
})
</script>


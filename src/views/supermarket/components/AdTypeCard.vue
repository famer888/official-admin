<template>
  <div
    class="bg-[#F6F8FF] rounded-[15px] overflow-hidden flex flex-col md:flex-row gap-4 md:gap-6 transition-all duration-300 hover:-translate-y-0.5 aspect-[526/232]"
    style="container-type: inline-size;"
  >
  <div class="w-full md:w-[35.17%] h-full bg-[#EAECF6] flex items-center justify-center">
    <div class="flex-shrink-0 flex items-center justify-center w-full h-full">
      <div
        class="rounded-2xl overflow-hidden bg-[#EAECF6] relative flex items-center justify-center h-[calc(100%-26px)] aspect-[185/227]"
      >
        <img
          v-if="adData.image"
          :src="adData.image"
          :alt="adData.title"
          class="object-contain aspect-[120/210] max-w-full max-h-full"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
          <div class="text-gray-400 text-sm">{{ adData.displayScenario || adData.title }}</div>
        </div>
      </div>
    </div>
  </div>
   
    <div 
      class="flex-1 flex flex-col justify-center p-3 md:p-5"
      style="font-size: calc(100cqw * 0.0304);"
    >
      <h2 
        class="font-semibold text-gray-800 mb-2 md:mb-2 m-0 mt-1"
        style="font-size: 1.5em;"
      >
        {{ adData.displayScenario || adData.title }}
      </h2>
      <n-tooltip 
        v-if="isTextTruncated" 
        trigger="hover" 
        :show-arrow="false" 
        :tooltip-style="{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }"
      >
        <template #trigger>
          <div 
            ref="textRef" 
            class="text-[#86909C] leading-relaxed mb-3 md:mb-3 m-0 overflow-hidden line-clamp-3"
            style="font-size: 0.875em;"
          >
            {{ adData.advertiseDesc  }}
          </div>
        </template>
        <template #default>
          <div style="max-width: 300px; white-space: normal; word-break: break-word;">
            {{ adData.advertiseDesc }}
          </div>
        </template>
      </n-tooltip>
      <div 
        v-else
        ref="textRef" 
        class="text-[#86909C] leading-relaxed mb-3 md:mb-3 m-0 overflow-hidden line-clamp-3"
        style="font-size: 0.875em;"
      >
        {{ adData.advertiseDesc  }}
      </div>
      <n-button
        type="primary"
        class="rounded-full border-2 border-[#3a82f9] text-[#3a82f9] bg-white hover:bg-[#3a82f9] hover:text-white mt-3 md:mt-6 w-[35.8%] h-[18.97%]"
        style="font-size: 1em;"
        @click="handleBuy"
      >
        立即选购
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { NButton, NTooltip } from 'naive-ui'
import type { AdTypeData } from '../types'

const props = defineProps<{
  adData: AdTypeData
}>()

const emit = defineEmits<{
  buy: [adData: AdTypeData]
}>()

const textRef = ref<HTMLDivElement>()
const isTextTruncated = ref(false)

const checkTextTruncated = () => {
  nextTick(() => {
    if (textRef.value) {
      // 检查 scrollHeight 是否大于 clientHeight，如果大于说明文本被截断了
      isTextTruncated.value = textRef.value.scrollHeight > textRef.value.clientHeight
    }
  })
}

onMounted(() => {
  checkTextTruncated()
})

watch(
  () => props.adData?.advertiseDesc || props.adData?.description,
  () => {
    checkTextTruncated()
  }
)

const handleBuy = () => {
  emit('buy', props.adData)
}
</script>



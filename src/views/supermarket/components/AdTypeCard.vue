<template>
  <div
    class="bg-[#F6F8FF] rounded-[20px] overflow-hidden flex flex-col md:flex-row gap-4 md:gap-6 shadow-md transition-all duration-300 h-full hover:shadow-lg hover:-translate-y-0.5"
  >
  <div class="w-full md:w-[45%] h-auto md:h-full bg-[#EAECF6] flex items-center justify-center p-4 md:p-6">
    <div class="flex-shrink-0 flex items-center">
      <div
        class="w-[160px] md:w-[200px] h-[240px] md:h-[360px] rounded-3xl relative"
      >
        <div class="w-full h-full rounded-2xl overflow-hidden bg-[#EAECF6] relative">
          <img
            v-if="adData.image"
            :src="adData.image"
            :alt="adData.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
            <div class="text-gray-400 text-sm">{{ adData.displayScenario || adData.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
   
    <div class="flex-1 flex flex-col justify-center p-4 md:p-6">
      <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-2 md:mb-3 m-0 mt-1">{{ adData.displayScenario || adData.title }}</h2>
      <n-tooltip 
        v-if="isTextTruncated" 
        trigger="hover" 
        :show-arrow="false" 
        :tooltip-style="{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }"
      >
        <template #trigger>
          <div 
            ref="textRef" 
            class="text-sm md:text-base text-[#86909C] leading-relaxed mb-4 md:mb-5 m-0 overflow-hidden line-clamp-4"
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
        class="text-sm md:text-base text-[#86909C] leading-relaxed mb-4 md:mb-5 m-0 overflow-hidden line-clamp-4"
      >
        {{ adData.advertiseDesc  }}
      </div>
      <n-button
        type="primary"
        class="w-full md:w-[200px] h-[50px] md:h-[60px        <template #icon></template>
        ] text-sm rounded-full border-2 border-[#3a82f9] text-[#3a82f9] bg-white hover:bg-[#3a82f9] hover:text-white mt-4 md:mt-10"
        @click="handleBuy"
      >
        立即选购
      </n-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, watch } from 'vue'
import { NButton, NTooltip } from 'naive-ui'
import type { AdTypeData } from '../types'

export default defineComponent({
  name: 'AdTypeCard',
  components: {
    NButton,
    NTooltip,
  },
  props: {
    adData: {
      type: Object as () => AdTypeData,
      required: true,
    },
  },
  emits: ['buy'],
  setup(props, { emit }) {
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

    return {
      textRef,
      isTextTruncated,
      handleBuy,
    }
  },
})
</script>



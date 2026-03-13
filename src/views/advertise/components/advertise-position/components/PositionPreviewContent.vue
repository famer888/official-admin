<template>
  <div class="p-5 rounded-[12px]">
    <div class="mb-3 text-[16px] text-[#1f2937] font-semibold">广告位示意图:</div>
    <div
      class="w-full h-[460px] rounded-[8px] border border-dashed border-[#7f96bb] overflow-hidden flex items-center justify-center"
    >
      <img
        v-if="previewImage"
        :src="previewImage"
        alt="广告位示意图"
        class="w-full h-full object-contain"
      />
    </div>
    <div class="mt-4 text-[16px] text-[#1f2937] font-semibold">
      预估展示量：{{ displayPv }} PV/日
    </div>
    <div class="flex justify-center mt-8">
      <n-button type="primary" class="!w-[200px]" @click="emit('close')">关闭</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    estimatedPv?: number
    previewImage?: string
  }>()

  const emit = defineEmits<{
    (e: 'close'): void
  }>()

  const displayPv = computed(() => Number(props.estimatedPv || 0).toLocaleString())
  const previewImage = computed(() => props.previewImage || '')
</script>

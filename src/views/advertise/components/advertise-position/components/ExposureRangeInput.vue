<template>
  <div class="inline-flex items-center gap-2">
    <n-input-number
      :value="min"
      :show-button="false"
      clearable
      placeholder="1-9999"
      class="!w-[100px]"
      @update:value="(val) => emit('update:min', val)"
    />
    <span class="text-[#666] whitespace-nowrap">至</span>
    <n-input-number
      :value="max"
      :show-button="false"
      clearable
      placeholder="1-9999"
      class="!w-[100px]"
      @update:value="(val) => emit('update:max', val)"
    />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    min?: number | null
    max?: number | null
  }>()

  const emit = defineEmits<{
    (e: 'update:min', value: number | null): void
    (e: 'update:max', value: number | null): void
  }>()
</script>

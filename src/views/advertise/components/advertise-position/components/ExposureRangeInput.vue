<template>
  <div class="exposure-range">
    <n-input-number
      :value="min"
      :show-button="false"
      clearable
      placeholder="1-9999"
      class="range-input"
      @update:value="(val) => emit('update:min', val)"
    />
    <span class="range-separator">至</span>
    <n-input-number
      :value="max"
      :show-button="false"
      clearable
      placeholder="1-9999"
      class="range-input"
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

<style scoped lang="less">
  .exposure-range {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .range-input {
    width: 120px;
  }

  .range-separator {
    color: #666;
    white-space: nowrap;
  }
</style>

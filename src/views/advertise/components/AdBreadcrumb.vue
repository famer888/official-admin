<template>
  <div class="flex items-center gap-3 text-base mb-5">
    <span
      class="text-[#1D2129] cursor-pointer hover:text-[#3A82F9] font-medium"
      @click="$emit('back')"
    >
      {{ parentTitle }}
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
    <span class="text-[#3A82F9]">{{ currentTitle }}</span>
  </div>
</template>

<script setup>
  defineProps({
    parentTitle: { type: String, default: '广告管理' },
    currentTitle: { type: String, required: true },
  })
  defineEmits(['back'])
</script>

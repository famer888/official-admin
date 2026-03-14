<!--
  广告管理 - 通用面包屑导航
  Props:
    - parentTitle: 父级标题（默认"广告管理"）
    - currentTitle: 当前页标题
  Events:
    - back: 点击父级标题时触发，用于返回上级页面
-->
<template>
  <div class="flex items-center gap-3 text-base mb-5">
    <span
      class="text-[#1D2129] cursor-pointer hover:text-[#3A82F9] font-medium"
      @click="$emit('back')"
    >
      {{ parentTitle }}
    </span>
    <SvgIcon name="breadcrumb-slash" :size="12" color="#3A82F9" />
    <span class="text-[#3A82F9]">{{ currentTitle }}</span>
  </div>
</template>

<script setup>
  import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'

  defineProps({
    parentTitle: { type: String, default: '广告管理' },
    currentTitle: { type: String, required: true },
  })
  defineEmits(['back'])
</script>

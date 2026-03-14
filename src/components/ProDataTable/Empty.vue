<!--
  ProDataTable - 空状态占位组件
  当表格无数据时展示空状态插画 + 提示文案
  插画 SVG 存放于 src/assets/images/data-table-empty.svg
-->
<template>
  <div class="py-[150px] flex items-center justify-center flex-col gap-5">
    <img :src="emptyImg" alt="暂无数据" width="240" height="240" />
    <span class="text-base leading-4 text-[#86909C]">暂无数据</span>
  </div>
</template>

<script setup>
  import emptyImg from '@/assets/images/data-table-empty.svg'
</script>

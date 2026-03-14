<!--
  广告管理 - 投放位置卡片
  展示单个投放位置信息：广告位、投放日期、投放预算
  Props:
    - position: { adSlot, dateRange, budget }
    - index: 序号（从 0 开始，显示为 index+1）
-->
<template>
  <div class="flex-1 min-w-[300px] rounded bg-[#F4F5F9] p-4">
    <div class="text-base leading-4 font-medium text-[#455980] mb-2">
      位置{{ index + 1 }}
    </div>
    <div class="text-sm leading-[26px]">
      <div>
        <span class="font-medium text-[#455980]">广告位：</span>
        <span class="text-[#86909C]">{{ position.adSlot }}</span>
      </div>
      <div>
        <span class="font-medium text-[#455980]">投放日期：</span>
        <span class="text-[#86909C]">{{ position.dateRange }}</span>
      </div>
      <div>
        <span class="font-medium text-[#455980]">投放预算：</span>
        <span class="text-[#86909C]">{{ position.budget }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    position: { type: Object, required: true },
    index: { type: Number, required: true },
  })
</script>

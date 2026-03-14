<!--
  广告管理 - 广告创意卡片
  展示单条广告创意：标题、素材预览、上传规格说明、跳转链接
  Props:
    - creative: { title, imageUrl, ratio, link }
    - index: 序号（从 0 开始，显示为 index+1）
    - editable: 是否可编辑跳转链接（编辑页 true，详情页 false）
  Events:
    - update:link: 跳转链接变更时触发（仅 editable=true 时）
-->
<template>
  <div class="flex-1 min-w-[300px] rounded bg-[#F4F5F9] p-4 flex flex-col gap-4">
    <!-- 素材标题 -->
    <div class="text-base leading-4 font-medium text-black">
      素材{{ index + 1 }}：{{ creative.title }}
    </div>

    <!-- 素材预览 & 上传规格 -->
    <div class="flex gap-4">
      <div
        class="w-[130px] h-[130px] rounded-2xl overflow-hidden bg-white flex-shrink-0 flex items-center justify-center"
      >
        <img
          v-if="creative.imageUrl"
          :src="creative.imageUrl"
          alt="素材预览"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-xs text-[#999]">暂无图片</span>
      </div>
      <ul class="text-sm leading-[26px] font-medium text-[#455980] list-disc pl-4">
        <li>支持上传jpg、png、webp 格式的文件</li>
        <li>限制上传文件大小5M</li>
        <li>限制图片的尺寸比例为 【{{ creative.ratio }}】</li>
      </ul>
    </div>

    <!-- 跳转链接：editable 时为输入框，否则为只读文本 -->
    <div class="flex items-center gap-3 w-full">
      <span class="text-base leading-4 text-[#1D2129]">跳转连接</span>
      <input
        v-if="editable"
        :value="creative.link"
        type="text"
        class="flex-1 h-9 px-3 bg-white border-none rounded text-sm text-[#1D2129] outline-none placeholder:text-[#86909C]"
        @input="$emit('update:link', $event.target.value)"
      />
      <span v-else class="bg-white flex-1 py-[11px] px-3 rounded text-sm">
        <span v-if="creative.link" class="text-[#1D2129]">{{ creative.link }}</span>
        <span v-else class="text-[#86909C]">无</span>
      </span>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    creative: { type: Object, required: true },
    index: { type: Number, required: true },
    editable: { type: Boolean, default: false },
  })
  defineEmits(['update:link'])
</script>

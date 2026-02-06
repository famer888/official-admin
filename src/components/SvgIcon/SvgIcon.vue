<template>
  <span :class="['svg-icon', className]" :style="iconStyle" v-html="svgContent"></span>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  name: string;
  size?: string | number;
  color?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  color: 'currentColor',
  className: ''
});

// 使用 Vite 的 glob 导入所有 SVG 文件
const svgModules = import.meta.glob('@/assets/svgIcon/*.svg', {
  as: 'raw',
  eager: true
}) as Record<string, string>;

const svgContent = ref<string>('');

// 计算样式
const iconStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color
}));

// 处理 SVG，使其支持 currentColor
const processSvg = (svg: string): string => {
  if (svg.includes('currentColor')) return svg;
  return svg
    .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
    .replace(/fill="[^"]*"/g, (match) => (match.includes('fill="none"') ? match : 'fill="currentColor"'));
};

// 加载 SVG
const loadSvg = (name: string) => {
  const matchedPath = Object.keys(svgModules).find(
    (path) => path.split('/').pop()?.replace('.svg', '') === name
  );
  if (matchedPath && svgModules[matchedPath]) {
    svgContent.value = processSvg(svgModules[matchedPath]);
  }
};

// 监听 name 变化
watch(() => props.name, loadSvg, { immediate: true });
</script>

<style scoped lang="less">
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 1;

  :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>

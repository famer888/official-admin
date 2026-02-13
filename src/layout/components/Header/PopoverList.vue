<template>
  <div 
    v-if="show"
    :ref="popoverRef"
    class="absolute top-full left-1/2 -translate-x-1/2 w-[290px] bg-white rounded-lg shadow-lg overflow-hidden z-[1000] mt-2 flex flex-col"
    @click.stop
  >
    <!-- 顶部插槽 -->
    <div v-if="$slots.header" class="py-3 px-4 border-b border-[#f0f0f0] flex flex-col items-center justify-center bg-white">
      <slot name="header"></slot>
    </div>
    
    <!-- 列表区域 -->
    <div class="max-h-[300px] overflow-y-auto p-0">
      <!-- 加载状态 -->
      <div v-if="loading" class="py-10 px-5 text-center text-[#86909c] text-sm">
        {{ loadingText || '加载中...' }}
      </div>
      <!-- 列表项 -->
      <template v-else>
        <div
          v-for="(item, index) in list"
          :key="getItemKey(item, index)"
          class="flex items-center h-[46px] px-4 border-b border-[#DEE9FF] transition-colors last:border-b-0"
          :class="getItemClass(item, index)"
          @click="handleItemClick(item, index)"
          @mouseenter="handleMouseEnter(item, index)"
          @mouseleave="handleMouseLeave(item, index)"
        >
          <slot name="item" :item="item" :index="index">
            <!-- 默认渲染 -->
            <div v-if="!hideIcon" class="w-7 h-7 flex-shrink-0 flex items-center justify-center mr-[7px]">
              <img v-if="item.icon" :src="item.icon" alt="icon" class="w-6 h-6" />
            </div>
            <div class="flex-1 min-w-0 overflow-hidden flex items-center">
              <div class="text-[15px] font-medium leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis" :class="getTextClass(item, index)">
                {{ item.label || item.message || item.text }}
              </div>
            </div>
          </slot>
        </div>
        <!-- 空状态 -->
        <div v-if="list.length === 0 && !loading" class="py-10 px-5 text-center text-[#86909c] text-sm">
          {{ emptyText || '暂无数据' }}
        </div>
      </template>
    </div>
    
    <!-- 底部插槽 -->
    <div v-if="$slots.footer" class="py-3 px-4 border-t border-[#f0f0f0] flex flex-col items-center justify-center bg-white">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  list: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  },
  emptyText: {
    type: String,
    default: ''
  },
  hideIcon: {
    type: Boolean,
    default: false
  },
  hoveredIndex: {
    type: Number,
    default: -1
  },
  selectedIndex: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits(['item-click', 'mouse-enter', 'mouse-leave'])

const popoverRef = ref(null)

const getItemKey = (item, index) => {
  return item.id || item.messageId || item.key || index
}

const getItemClass = (item, index) => {
  const classes = []
  if (props.hoveredIndex === index || props.selectedIndex === index) {
    classes.push('bg-[#DEE9FF]')
  }
  if (item.type !== 'hint') {
    classes.push('cursor-pointer')
  }
  if (item.type === 'hint') {
    classes.push('justify-center')
  }
  return classes
}

const getTextClass = (item, index) => {
  if (item.type === 'hint') {
    return 'text-[#86909c]'
  }
  if (props.hoveredIndex === index || props.selectedIndex === index) {
    return 'text-[#3A82F9]'
  }
  return 'text-[#455980]'
}

const handleItemClick = (item, index) => {
  emit('item-click', item, index)
}

const handleMouseEnter = (item, index) => {
  emit('mouse-enter', item, index)
}

const handleMouseLeave = (item, index) => {
  emit('mouse-leave', item, index)
}

defineExpose({
  popoverRef,
  contains: (target) => {
    return popoverRef.value && popoverRef.value.contains(target)
  }
})
</script>


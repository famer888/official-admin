<template>
  <div :class="{ 'bg-white rounded-2xl shadow border pb-2': !noWrapperStyle }">
    <div
      v-if="title !== false"
      class="flex p-4 border-b border-[#e5e5e5] justify-between items-center"
    >
      <div class="flex text-base font-bold items-center">
        <div>
          <component
            :is="title.icon"
            v-if="title.icon"
            class="w-[20px] h-[20px]"
            :style="{ color: '#999' }"
          ></component>
        </div>
        <div>{{ title.title }}</div>
      </div>
      <div class="flex gap-2">
        <slot name="filterForm"></slot>
      </div>
    </div>
    <slot name="content"></slot>
  </div>
</template>
<script lang="ts" setup>
  import { DataTableProps } from './types'

  const props = withDefaults(
    defineProps<{ title: DataTableProps['title']; noWrapperStyle?: boolean }>(),
    {
      title: () => false,
      noWrapperStyle: false,
    }
  )
</script>

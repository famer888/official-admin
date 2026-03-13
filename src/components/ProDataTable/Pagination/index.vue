<template>
  <div
    v-if="props.pagination !== false"
    class="n-data-pagination items-center flex justify-end p-4 gap-2 pb-0"
  >
    <n-pagination v-bind="props.paginationProps" show-quick-jumper show-size-picker />
    <span>页</span>
  </div>
</template>
<script setup lang="ts">
  import { DataTableProps } from '../types'

  const props = withDefaults(
    defineProps<Pick<DataTableProps, 'pagination' | 'paginationProps'>>(),
    {
      pagination: true,
    }
  )
</script>
<style lang="less">
  .n-data-pagination {
    & .n-data-table__pagination {
      margin: 12px !important;
    }

    & .n-pagination {
      position: relative;
      width: 100%;
      justify-content: end;
      color: #1d2129;
      font-size: 14px;

      // & .n-pagination-prefix {
      //   position: absolute;
      //   bottom: 5px;
      //   left: 0;
      // }
    }
    & .n-pagination-item {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      max-width: 32px !important;
      border: 1px solid #86909c !important;
      color: #86909c !important;
    }
    & .n-pagination-item--active {
      background: #3276ff !important;
      border: 1px solid #3276ff !important;
      color: #ffffff !important;
    }
    & .n-pagination-item--button {
      border: none !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      max-width: 32px !important;
      background-color: transparent !important;
    }
    & .n-pagination-quick-jumper {
      color: #1d2129 !important;
    }
    & .n-base-selection,
    & .n-input {
      height: 32px !important;
    }
    & .n-base-selection-label {
      height: 32px !important;
    }
    & .n-input__input-el {
      height: 32px !important;
    }
  }
</style>

<template>
  <div v-if="props.pagination !== false" class="n-data-pagination flex justify-end p-4">
    <n-pagination v-bind="props.paginationProps"></n-pagination>
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

      & .n-pagination-prefix {
        position: absolute;
        bottom: 5px;
        left: 0;
      }
    }
  }
</style>

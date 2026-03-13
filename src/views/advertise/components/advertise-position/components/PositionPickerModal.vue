<template>
  <div class="w-full">
    <div class="mb-3 text-[14px] text-[#222]">
      <span class="mr-2 font-medium">已选择的广告位置：</span>
      <span class="text-[#666]">{{ selectedSummary }}</span>
    </div>

    <div class="search-wrap mb-2">
      <pro-form
        :schemas="searchSchemas"
        :form-props="searchFormProps"
        :record="filters"
        class="search-pro-form"
        @submit="handleSearch"
        @close="handleResetSearch"
      >
        <template #exposureRange="{ model }">
          <ExposureRangeInput v-model:min="model.exposureMin" v-model:max="model.exposureMax" />
        </template>
      </pro-form>
    </div>
    <!-- 状态图例 -->
    <!-- <div class="legend-wrap">
      <div v-for="item in statusLegendOptions" :key="item.key" class="legend-item">
        <span class="legend-dot" :class="item.className"></span>
        <span>{{ item.label }}</span>
      </div>
    </div> -->

    <n-spin :show="loading">
      <div class="max-w-full max-h-[420px] overflow-auto">
        <table class="w-max min-w-full border-collapse table-fixed bg-white">
          <thead>
            <tr>
              <th
                class="sticky left-0 z-[8] min-w-[120px] border border-[#edf1f7] bg-[#f6f8fd] p-0 text-center text-[12px] leading-none text-[#5a5a5a]"
                rowspan="2"
              >
                APP名称
              </th>
              <th
                class="sticky left-[120px] z-[7] min-w-[110px] border border-[#edf1f7] bg-[#f6f8fd] p-0 text-center text-[12px] leading-none text-[#5a5a5a]"
                rowspan="2"
              >
                广告位
              </th>
              <th
                v-for="group in monthGroups"
                :key="group.label"
                :colspan="group.span"
                class="h-[28px] min-w-[32px] border border-[#edf1f7] bg-[#6f87a8] p-0 text-center text-[14px] font-medium leading-none text-white"
              >
                {{ group.label }}
              </th>
            </tr>
            <tr>
              <th
                v-for="day in calendarDays"
                :key="day.key"
                class="h-[32px] min-w-[32px] border border-[#edf1f7] bg-[#9dc2ff] p-0 text-center text-[12px] font-medium leading-none text-white"
              >
                {{ day.dayLabel }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!pagedRows.length">
              <td :colspan="calendarDays.length + 2" class="bg-white py-[30px]">
                <n-empty description="暂无可选广告位" />
              </td>
            </tr>
            <tr v-for="(row, rowIndex) in pagedRows" :key="row.rowId">
              <td
                class="sticky left-0 z-[8] h-[32px] min-w-[120px] border border-[#edf1f7] p-0 text-center text-[12px] font-medium leading-none text-[#39475e]"
                :class="getLeftCellClass(rowIndex)"
              >
                {{ row.appName }}
              </td>
              <td
                class="sticky left-[120px] z-[7] h-[32px] min-w-[110px] border border-[#edf1f7] p-0 text-center text-[12px] font-medium leading-none text-[#39475e]"
                :class="getLeftCellClass(rowIndex)"
              >
                <span class="cursor-pointer text-[#3a82f9]" @click.stop="openPreview(row)">
                  {{ row.positionName }}
                </span>
              </td>
              <td
                v-for="day in calendarDays"
                :key="`${row.rowId}-${day.key}`"
                class="h-[32px] min-w-[32px] border border-[#edf1f7] p-0 text-center text-[12px] leading-none transition-all"
                :class="getCellClass(row, day.key)"
                @click="toggleCell(row, day.key)"
              >
                {{ getCellText(row, day.key) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </n-spin>

    <div class="mt-[14px] flex items-center justify-between gap-4">
      <n-pagination
        v-model:page="pageNo"
        v-model:page-size="pageSize"
        :item-count="total"
        :page-sizes="[10, 20, 30, 50]"
        show-size-picker
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
      <div class="flex gap-3">
        <n-button class="w-[120px]" @click="emit('cancel')">取消</n-button>
        <n-button type="primary" class="w-[120px]" @click="handleSave">保存</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ProForm from '@/components/ProForm/index.vue'
  import ExposureRangeInput from './ExposureRangeInput.vue'
  import { searchSchemas } from '../hooks/options'
  import { usePositionPreviewModal } from '../hooks/usePositionPreviewModal'
  import { useAdvertisePosition } from '../hooks/useAdvertisePosition'
  import type { PositionRow, SearchParams, SelectedPlacementItem } from '../hooks/types'

  const props = defineProps<{
    initialSelected?: SelectedPlacementItem[]
  }>()

  // 组件对外事件：变更/保存/取消
  const emit = defineEmits<{
    (e: 'change', list: SelectedPlacementItem[]): void
    (e: 'save', list: SelectedPlacementItem[]): void
    (e: 'cancel'): void
  }>()

  // 使用 hook 管理数据与交互规则
  // hook 返回值按用途拆分：
  // 1) 日历表头与列表：calendarDays / monthGroups / pagedRows
  // 2) 分页状态：loading / pageNo / pageSize / total
  // 3) 选择状态：selectedSummary / selectedList / isSelected
  // 4) 交互方法：setFilters / toggleCell / handlePageChange / handlePageSizeChange
  const {
    calendarDays,
    monthGroups,
    loading,
    pageNo,
    pageSize,
    total,
    pagedRows,
    selectedSummary,
    selectedList,
    filters,
    isSelected,
    setFilters,
    toggleCell,
    handlePageChange,
    handlePageSizeChange,
  } = useAdvertisePosition({
    onChange: (list) => {
      // 每次点击日期格都实时向外抛最新数据
      emit('change', list)
    },
    initialSelected: props.initialSelected || [],
  })
  const { openPositionPreviewModal } = usePositionPreviewModal()

  const searchFormProps = {
    layout: 'inline',
    labelPlacement: 'left',
    labelWidth: 120,
    showResetButton: true,
    submitButtonText: '查询',
    resetButtonText: '重置',
    gridProps: { cols: '1 m:2 l:4', xGap: 8, yGap: 8 },
    submitButtonOptions: {
      type: 'primary',
    },
  }

  const getCellClass = (row: PositionRow, dateKey: string) => {
    if (isSelected(row.rowId, dateKey)) return 'bg-[#ffe7ea] text-[#e3324a] font-semibold'
    const status = row.cells[dateKey]?.status
    if (status === 'disabled') return 'cursor-not-allowed bg-[#6c7584] text-transparent'
    if (status === 'occupied') return 'cursor-not-allowed bg-[#e9edf2] text-transparent'
    return 'cursor-pointer bg-white text-[#6f7f98] hover:bg-[#f0f7ff]'
  }

  const getCellText = (row: PositionRow, dateKey: string) => {
    const cell = row.cells[dateKey]
    if (!cell) return ''
    if (cell.status !== 'available') return ''
    return `${cell.price}`
  }

  const openPreview = (row: PositionRow) => {
    openPositionPreviewModal({
      estimatedPv: row.estimatedPv,
    })
  }

  const getLeftCellClass = (rowIndex: number) =>
    rowIndex % 2 === 1 ? 'bg-[#dcdeea]' : 'bg-[#eef3fb]'

  // 顶部查询（ProForm submit）
  const handleSearch = (values: Partial<SearchParams>) => {
    setFilters({
      appName: values.appName || '',
      positionKeyword: values.positionKeyword || '',
      exposureMin: values.exposureMin ?? null,
      exposureMax: values.exposureMax ?? null,
    })
  }

  const handleResetSearch = () => {
    setFilters({
      appName: '',
      positionKeyword: '',
      exposureMin: null,
      exposureMax: null,
    })
  }

  // 点击保存，返回当前全部选中明细
  const handleSave = () => {
    const data = selectedList.value
    emit('save', data)
  }
</script>

<style scoped lang="less">
  .search-wrap {
    :deep(.n-space) {
      margin-top: 0 !important;
      justify-content: flex-start !important;
    }
    :deep(.n-form-item-feedback-wrapper) {
      min-height: 0;
    }
  }

  :deep(.search-pro-form .n-form) {
    .n-grid {
      align-items: center;
    }
  }
</style>

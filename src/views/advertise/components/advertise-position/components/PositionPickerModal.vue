<template>
  <div class="position-modal">
    <div class="selected-bar">
      <span class="selected-label">已选择的广告位置：</span>
      <span class="selected-value">{{ selectedSummary }}</span>
    </div>

    <div class="search-wrap">
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
      <div class="table-scroll">
        <table class="position-table">
          <thead>
            <tr>
              <th class="fixed-col fixed-app">APP名称</th>
              <th class="fixed-col fixed-position">广告位</th>
              <th
                v-for="group in monthGroups"
                :key="group.label"
                :colspan="group.span"
                class="month-cell"
              >
                {{ group.label }}
              </th>
            </tr>
            <tr>
              <th class="fixed-col fixed-app">APP名称</th>
              <th class="fixed-col fixed-position">广告位</th>
              <th v-for="day in calendarDays" :key="day.key" class="day-cell">
                {{ day.dayLabel }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!pagedRows.length">
              <td :colspan="calendarDays.length + 2" class="empty-cell">
                <n-empty description="暂无可选广告位" />
              </td>
            </tr>
            <tr v-for="row in pagedRows" :key="row.rowId">
              <td class="fixed-col fixed-app body-left">{{ row.appName }}</td>
              <td class="fixed-col fixed-position body-left">{{ row.positionName }}</td>
              <td
                v-for="day in calendarDays"
                :key="`${row.rowId}-${day.key}`"
                class="value-cell"
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

    <div class="footer-wrap">
      <n-pagination
        v-model:page="pageNo"
        v-model:page-size="pageSize"
        :item-count="total"
        :page-sizes="[10, 20, 30, 50]"
        show-size-picker
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
      <div class="actions">
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

  const searchFormProps = {
    layout: 'inline',
    labelPlacement: 'left',
    labelWidth: 120,
    showResetButton: false,
    submitButtonText: '查询',
    gridProps: { cols: '1 m:2 l:5', xGap: 8 },
    submitButtonOptions: {
      type: 'primary',
    },
  }

  const getCellClass = (row: PositionRow, dateKey: string) => {
    if (isSelected(row.rowId, dateKey)) return 'selected'
    const status = row.cells[dateKey]?.status
    if (status === 'disabled') return 'disabled'
    if (status === 'occupied') return 'occupied'
    return 'available'
  }

  const getCellText = (row: PositionRow, dateKey: string) => {
    const cell = row.cells[dateKey]
    if (!cell) return ''
    if (cell.status !== 'available') return ''
    return `${cell.price}`
  }

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
  .position-modal {
    width: 100%;
  }

  .selected-bar {
    margin-bottom: 12px;
    font-size: 14px;
    color: #222;
  }

  .selected-label {
    margin-right: 8px;
    font-weight: 500;
  }

  .selected-value {
    color: #666;
  }

  .search-wrap {
    margin-bottom: 6px;
    // border: 1px solid #e8ecf3;
    :deep(.n-space) {
      margin-top: 0 !important;
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

  .legend-wrap {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
    color: #666;
    font-size: 12px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .table-scroll {
    max-width: 100%;
    max-height: 420px;
    overflow: auto;
    border: 1px solid #e8ecf3;
  }

  .position-table {
    width: max-content;
    border-collapse: collapse;
    table-layout: fixed;
    background: #fff;
  }

  .position-table th,
  .position-table td {
    border: 1px solid #edf1f7;
    text-align: center;
    font-size: 12px;
    line-height: 1;
    min-width: 32px;
    height: 32px;
    color: #5a5a5a;
    padding: 0;
  }

  .position-table .month-cell {
    height: 28px;
    background: #6f87a8;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }

  .position-table .day-cell {
    background: #9dc2ff;
    color: #fff;
    font-weight: 500;
  }

  .position-table .fixed-col {
    position: sticky;
    left: 0;
    z-index: 6;
    background: #f6f8fd;
    min-width: 120px;
  }

  .position-table .fixed-position {
    left: 120px;
    min-width: 110px;
    z-index: 7;
  }

  .position-table .fixed-app {
    min-width: 120px;
    z-index: 8;
  }

  .position-table .body-left {
    color: #39475e;
    font-weight: 500;
    background: #eef3fb;
  }

  .position-table .value-cell {
    cursor: pointer;
    user-select: none;
    transition: all 0.2s;
  }

  .position-table .value-cell.available {
    background: #fff;
    color: #6f7f98;
  }

  .position-table .value-cell.available:hover {
    background: #f0f7ff;
  }

  .position-table .value-cell.disabled {
    cursor: not-allowed;
    background: #6c7584;
    color: transparent;
  }

  .position-table .value-cell.occupied {
    cursor: not-allowed;
    background: #e9edf2;
    color: transparent;
  }

  .position-table .value-cell.selected {
    background: #ffe7ea;
    color: #e3324a;
    font-weight: 600;
  }

  .position-table .empty-cell {
    padding: 30px 0;
    background: #fff;
  }

  .footer-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
    gap: 16px;
  }

  .actions {
    display: flex;
    gap: 12px;
  }
</style>

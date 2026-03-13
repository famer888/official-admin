import { computed, ref } from 'vue'
import type {
  CalendarDay,
  MonthGroup,
  PositionCell,
  PositionRow,
  SearchParams,
  SelectedPlacementItem,
} from './types'

// 模拟 APP / 广告位名称（后续可替换为接口字典）
const APP_NAMES = ['黑犀闪闪APP', '黑犀知音APP', '黑犀资讯APP', '黑犀视频APP']
const POSITION_NAMES = ['特色APP', '首页信息流', '启动页开屏', '短视频贴片']

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateText = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day} 00:00:00`
}

const buildCalendarDays = (count = 30): CalendarDay[] => {
  const start = new Date()
  const days: CalendarDay[] = []
  for (let i = 0; i < count; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const key = formatDateKey(date)
    days.push({
      key,
      monthLabel: `${date.getFullYear()}年${date.getMonth() + 1}月`,
      dayLabel: `${date.getDate()}`.padStart(2, '0'),
      fullLabel: key,
      date,
    })
  }
  return days
}

// 将 30 天按月份分组，用于双层表头第一行
const buildMonthGroups = (days: CalendarDay[]): MonthGroup[] => {
  const groups: MonthGroup[] = []
  days.forEach((day) => {
    const last = groups[groups.length - 1]
    if (!last || last.label !== day.monthLabel) {
      groups.push({ label: day.monthLabel, span: 1 })
    } else {
      last.span += 1
    }
  })
  return groups
}

// mock 单元格状态：深灰不可选、浅灰占用、白色可选（并带价格）
const createCell = (dateKey: string, rowIndex: number, dayIndex: number): PositionCell => {
  const token = (rowIndex + 1) * (dayIndex + 3)
  if (token % 11 === 0) {
    return { dateKey, status: 'disabled', price: 0 }
  }
  if (token % 7 === 0) {
    return { dateKey, status: 'occupied', price: 0 }
  }
  return { dateKey, status: 'available', price: (Math.floor(token % 9) + 1) * 1000 }
}

// 生成 mock 行数据
const buildMockRows = (days: CalendarDay[], total = 36): PositionRow[] => {
  return Array.from({ length: total }).map((_, index) => {
    const appName = APP_NAMES[index % APP_NAMES.length]
    const positionName = POSITION_NAMES[index % POSITION_NAMES.length]
    const rowId = `row-${index + 1}`
    const cells = days.reduce<Record<string, PositionCell>>((acc, day, dayIndex) => {
      acc[day.key] = createCell(day.key, index, dayIndex)
      return acc
    }, {})
    return {
      rowId,
      appId: `app-${(index % APP_NAMES.length) + 1}`,
      appName,
      positionId: `pos-${(index % POSITION_NAMES.length) + 1}`,
      positionName,
      slotCode: `T${`${(index % 10) + 1}`.padStart(2, '0')}`,
      slotName: `${positionName}-广告位`,
      estimatedPv: 50000 + ((index + 7) * 3719) % 180000,
      cells,
    }
  })
}

// 连续性判定：索引范围长度需等于选中数量
const checkContinuous = (indexes: number[]) => {
  if (indexes.length <= 1) return true
  const sorted = [...indexes].sort((a, b) => a - b)
  return sorted[sorted.length - 1] - sorted[0] + 1 === sorted.length
}

// 投放位置选择核心逻辑（筛选、分页、选择、结果回传）
export function useAdvertisePosition(options?: {
  onChange?: (list: SelectedPlacementItem[]) => void
  initialSelected?: SelectedPlacementItem[]
}) {
  const calendarDays = buildCalendarDays(30)
  const monthGroups = buildMonthGroups(calendarDays)
  const sourceRows = buildMockRows(calendarDays, 48)

  const loading = ref(false)
  const pageNo = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const selectedMap = ref<Record<string, Set<string>>>({})
  const filters = ref<SearchParams>({
    appName: '',
    positionKeyword: '',
    exposureMin: null,
    exposureMax: null,
  })

  const buildInitialSelectedMap = (items: SelectedPlacementItem[] = []) => {
    const nextMap: Record<string, Set<string>> = {}
    items.forEach((item) => {
      const dateKey = item.deliveryTime?.slice(0, 10)
      if (!dateKey) return
      // 优先使用 rowId 精确匹配；兼容旧数据再按业务字段匹配
      const row =
        sourceRows.find((rowItem) => rowItem.rowId === item.rowId) ||
        sourceRows.find(
          (rowItem) =>
            rowItem.appId === item.appId &&
            rowItem.positionId === item.positionId &&
            rowItem.slotCode === item.slotCode
        ) ||
        sourceRows.find((rowItem) => rowItem.appId === item.appId && rowItem.positionId === item.positionId)
      if (!row) return
      const cell = row.cells[dateKey]
      if (!cell || cell.status !== 'available') return
      if (!nextMap[row.rowId]) nextMap[row.rowId] = new Set<string>()
      nextMap[row.rowId].add(dateKey)
    })
    return nextMap
  }

  // 依据顶部筛选条件过滤数据
  const filteredRows = computed(() => {
    let rows = sourceRows
    const { appName, positionKeyword, exposureMin, exposureMax } = filters.value
    if (appName.trim()) {
      rows = rows.filter((row) => row.appName.includes(appName.trim()))
    }
    if (positionKeyword.trim()) {
      rows = rows.filter((row) => row.positionName.includes(positionKeyword.trim()))
    }
    if (exposureMin != null || exposureMax != null) {
      rows = rows.filter((row) => {
        const prices = Object.values(row.cells)
          .filter((cell) => cell.status === 'available')
          .map((cell) => cell.price)
        if (!prices.length) return false
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        if (exposureMin != null && maxPrice < exposureMin) return false
        if (exposureMax != null && minPrice > exposureMax) return false
        return true
      })
    }
    return rows
  })

  // 当前分页数据
  const pagedRows = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value
    return filteredRows.value.slice(start, start + pageSize.value)
  })

  // 顶部“已选择广告位置”文案
  const selectedSummary = computed(() => {
    const rowIds = Object.keys(selectedMap.value).filter((rowId) => selectedMap.value[rowId]?.size)
    if (!rowIds.length) return '暂无'
    const labels = rowIds.slice(0, 3).map((rowId) => {
      const row = sourceRows.find((item) => item.rowId === rowId)
      return row ? `${row.appName}-${row.positionName}` : rowId
    })
    if (rowIds.length > 3) {
      labels.push(`等${rowIds.length}个广告位`)
    }
    return labels.join('，')
  })

  // 对外回传的数据结构（每个选中日期一条）
  const selectedList = computed<SelectedPlacementItem[]>(() => {
    const result: SelectedPlacementItem[] = []
    Object.entries(selectedMap.value).forEach(([rowId, dateSet]) => {
      const row = sourceRows.find((item) => item.rowId === rowId)
      if (!row) return
      dateSet.forEach((dateKey) => {
        const cell = row.cells[dateKey]
        if (!cell || cell.status !== 'available') return
        const date = calendarDays.find((item) => item.key === dateKey)?.date
        if (!date) return
        result.push({
          rowId: row.rowId,
          appId: row.appId,
          appName: row.appName,
          positionId: row.positionId,
          positionName: row.positionName,
          slotCode: row.slotCode,
          slotName: row.slotName,
          deliveryTime: formatDateText(date),
          budget: cell.price,
        })
      })
    })
    return result.sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime))
  })

  const isSelected = (rowId: string, dateKey: string) => !!selectedMap.value[rowId]?.has(dateKey)

  // 更新筛选并回到第一页
  const setFilters = (next: Partial<SearchParams>) => {
    filters.value = { ...filters.value, ...next }
    pageNo.value = 1
    refresh()
  }

  // 本地刷新（模拟异步）
  const refresh = () => {
    loading.value = true
    setTimeout(() => {
      total.value = filteredRows.value.length
      loading.value = false
    }, 120)
  }

  // 日期格点击逻辑：只允许选择 available，且只能连续选择（不可选格自动跳过）
  const toggleCell = (row: PositionRow, dateKey: string) => {
    const cell = row.cells[dateKey]
    if (!cell || cell.status !== 'available') return
    const currentSet = new Set(selectedMap.value[row.rowId] || [])
    const selectableDateKeys = calendarDays
      .filter((day) => row.cells[day.key]?.status === 'available')
      .map((day) => day.key)
    const selectedIndexes = [...currentSet]
      .map((key) => selectableDateKeys.indexOf(key))
      .filter((idx) => idx >= 0)
      .sort((a, b) => a - b)
    const currentIndex = selectableDateKeys.indexOf(dateKey)
    if (currentIndex < 0) return

    if (currentSet.has(dateKey)) {
      // 取消选择时，只允许从连续区间两端取消
      if (selectedIndexes.length <= 1) {
        currentSet.delete(dateKey)
      } else {
        const minIndex = selectedIndexes[0]
        const maxIndex = selectedIndexes[selectedIndexes.length - 1]
        if (currentIndex !== minIndex && currentIndex !== maxIndex) {
          ;(window as any).$message?.warning('仅支持连续选择，取消中间日期会造成断选')
          return
        }
        currentSet.delete(dateKey)
      }
    } else {
      // 新增选择时，必须保持连续
      const nextIndexes = [...selectedIndexes, currentIndex]
      if (!checkContinuous(nextIndexes)) {
        ;(window as any).$message?.warning('仅支持连续日期选择，灰色不可选日期可自动跳过')
        return
      }
      currentSet.add(dateKey)
    }

    selectedMap.value = {
      ...selectedMap.value,
      [row.rowId]: currentSet,
    }
    // 每次点击都实时回传最新选择结果
    const latest = selectedList.value
    options?.onChange?.(latest)
  }

  const handlePageChange = (page: number) => {
    pageNo.value = page
    refresh()
  }

  const handlePageSizeChange = (size: number) => {
    pageSize.value = size
    pageNo.value = 1
    refresh()
  }

  // 回显：初始化外部传入的已选数据
  if (options?.initialSelected?.length) {
    selectedMap.value = buildInitialSelectedMap(options.initialSelected)
  }

  refresh()

  return {
    // 表格表头相关
    calendarDays,
    monthGroups,
    // 表格与分页状态
    loading,
    pageNo,
    pageSize,
    total,
    pagedRows,
    // 已选结果展示与回传
    selectedSummary,
    selectedList,
    // 顶部筛选与选择行为
    filters,
    isSelected,
    setFilters,
    toggleCell,
    // 分页事件处理
    handlePageChange,
    handlePageSizeChange,
  }
}

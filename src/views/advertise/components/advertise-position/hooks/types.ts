export type CellStatus = 'available' | 'disabled' | 'occupied'

export interface CalendarDay {
  key: string
  monthLabel: string
  dayLabel: string
  fullLabel: string
  date: Date
}

export interface MonthGroup {
  label: string
  span: number
}

export interface PositionCell {
  dateKey: string
  status: CellStatus
  price: number
}

export interface PositionRow {
  rowId: string
  appId: string
  appName: string
  positionId: string
  positionName: string
  slotCode: string
  slotName: string
  previewImage?: string
  estimatedPv?: number
  cells: Record<string, PositionCell>
}

export interface SearchParams {
  appName: string
  positionKeyword: string
  exposureMin?: number | null
  exposureMax?: number | null
}

export interface SelectedPlacementItem {
  rowId?: string
  appId: string
  appName: string
  positionId: string
  positionName: string
  slotCode: string
  slotName: string
  deliveryTime: string
  budget: number
}

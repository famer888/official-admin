import { format } from 'date-fns'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm'
const DATE_FORMAT = 'YYYY-MM-DD '

export function formatToDateTime(date: Date | number, formatStr = DATE_TIME_FORMAT): string {
  return format(date, formatStr)
}

export function formatToDate(date: Date | number, formatStr = DATE_FORMAT): string {
  return format(date, formatStr)
}

/**
 * 获取当前日期，格式为 YYYY-MM-DD
 * @returns {string} 格式化的日期字符串
 */
export function getCurrentDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
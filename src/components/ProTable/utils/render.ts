import { h } from 'vue'
import { NTag, NImage, NAvatar } from 'naive-ui'
import { useUser } from '@/store/modules/user'

const userStore = useUser()
const base = userStore.getBase

/**
 * 设置颜色透明度
 * @param hexColor - 十六进制颜色值
 * @param opacity - 透明度 (0-1)
 * @returns RGBA 颜色字符串
 */
function setOpacity(hexColor: string, opacity: number): string {
  // 移除颜色前面的 #
  const hex = hexColor.replace('#', '')

  // 将 hex 颜色转换为 RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 返回 RGBA 颜色，opacity 范围是 0 到 1
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * 渲染头像
 * @param src - 图片路径
 * @param size - 头像大小，默认 40
 * @returns VNode
 */
export function renderAvatar(src: string | null | undefined, size: number = 40) {
  return h(NAvatar, { src: src ? base + src : '', size, objectFit: 'cover' })
}

/**
 * 渲染图片
 * @param src - 图片路径
 * @param width - 图片宽度，默认 80
 * @returns VNode
 */
export function renderImage(src: string | null | undefined, width: number = 80) {
  return h(NImage, {
    src: src ? (src.includes('http') ? src : base + src) : '',
    width,
    objectFit: 'cover',
  })
}

/**
 * 渲染标签
 * @param text - 标签文本
 * @param color - 标签颜色，默认 'info'
 * @returns VNode
 */
export function renderTag(text: string, color: string = 'info') {
  return h(
    NTag,
    {
      color: {
        color: setOpacity(color, 0.1),
        borderColor: setOpacity(color, 0.3),
        textColor: setOpacity(color, 1),
      },
    },
    { default: () => text }
  )
}


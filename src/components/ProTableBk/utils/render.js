import { h } from 'vue'
import { NTag, NImage, NAvatar } from 'naive-ui'
import { useUser } from '@/store/modules/user'

const userStore = useUser()
const base = userStore.getBase

function setOpacity(hexColor, opacity) {
  // 移除颜色前面的 #
  const hex = hexColor.replace('#', '')

  // 将 hex 颜色转换为 RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 返回 RGBA 颜色，opacity 范围是 0 到 1
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function renderAvatar(src, size = 40) {
  return h(NAvatar, { src: src ? base + src : '', size, objectFit: 'cover' })
}

export function renderImage(src, width = 80) {
  return h(NImage, {
    src: src ? (src.includes('http') ? src : base + src) : '',
    width,
    objectFit: 'cover',
  })
}

export function renderTag(text, color = 'info') {
  return h(
    NTag,
    {
      color: {
        color: setOpacity(color, 0.1),
        borderColor: setOpacity(color, 0.3),
        textColor: setOpacity(color, 1),
      },
      bordered: false
    },
    { default: () => text }
  )
}

// 线上环境防调试、防查看源码的小工具
// 仅在非开发环境启用：禁止 F12 / Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+U、禁用右键菜单

export function setupProdGuard() {
  // 开发环境不做任何处理，方便调试
  if (import.meta.env.VITE_APP_ENV === 'development') return

  if (typeof window === 'undefined') return

  const blockKeyEvent = (e: KeyboardEvent) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    // Ctrl+U 查看源码
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const blockContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  window.addEventListener('keydown', blockKeyEvent, true)
  window.addEventListener('contextmenu', blockContextMenu, true)
}

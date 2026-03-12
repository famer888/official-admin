// 线上环境防调试、防查看源码的小工具
// 仅在非开发环境启用：禁止 F12 / Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+U、禁用右键菜单

export function setupProdGuard() {
  // 开发环境不做任何处理，方便调试
  if (import.meta.env.VITE_APP_ENV === 'development') return

  if (typeof window === 'undefined') return

  const blockKeyEvent = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase()
    const isCtrlOrCmd = e.ctrlKey || e.metaKey // Windows: Ctrl，Mac: Command

    // F12（Win 上常用的开发者工具快捷键）
    if (key === 'F12') {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    // Ctrl/Cmd + Shift + I / J / C  打开开发者工具
    if (isCtrlOrCmd && e.shiftKey && ['I', 'J', 'C'].includes(key)) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    // Ctrl/Cmd + U 查看源码
    if (isCtrlOrCmd && key === 'U') {
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

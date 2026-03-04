import { useGlobSetting } from '@/hooks/setting'

/**
 * SSE 连接管理类
 */
export class SSEManager {
  private eventSource: EventSource | null = null
  private reconnectTimer: number | null = null
  private reconnectDelay: number = 3000
  private onMessageCallback: ((data: any) => void) | null = null
  private onErrorCallback: ((error: Event) => void) | null = null
  private onOpenCallback: (() => void) | null = null

  /**
   * 建立 SSE 连接
   * @param userId 用户ID
   * @param onMessage 消息处理回调函数
   * @param onError 错误处理回调函数（可选）
   * @param onOpen 连接打开回调函数（可选）
   */
  connect(
    userId: string | number,
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
    onOpen?: () => void
  ) {
    // 如果已存在连接，先关闭
    this.close()

    if (!userId) {
      console.warn('用户ID不存在，无法建立 SSE 连接')
      return
    }

    // 保存回调函数
    this.onMessageCallback = onMessage
    this.onErrorCallback = onError || null
    this.onOpenCallback = onOpen || null

    try {
      // 获取 API 配置
      const { apiUrl, urlPrefix } = useGlobSetting()

      // 构建 SSE URL
      let sseUrl = import.meta.env.DEV ? '/admin-api/system/sse/subscribe' : '/proxy/sse/subscribe'
      // 添加用户ID参数（注意：参数名是 userId，不是 userld）
      sseUrl += `?userId=${userId}`
      let fullUrl = sseUrl
      const isDev = import.meta.env.DEV

      if (isDev) {
        if (urlPrefix) {
          fullUrl = `${urlPrefix}${sseUrl}`
        }
      } else {
        // 生产环境：使用完整的 URL
        if (urlPrefix) {
          fullUrl = `${urlPrefix}${sseUrl}`
        }
        if (apiUrl && typeof apiUrl === 'string') {
          fullUrl = `${apiUrl}${fullUrl}`
        }
      }

      console.log('SSE 连接 URL:', fullUrl)

      // 创建 EventSource 连接
      this.eventSource = new EventSource(fullUrl)

      // 监听消息事件
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (this.onMessageCallback) {
            this.onMessageCallback(data)
          }
        } catch (error) {
          console.error('解析 SSE 消息失败:', error)
        }
      }

      // 监听错误事件
      this.eventSource.onerror = (error) => {
        console.error('SSE 连接错误:', error)
        if (this.onErrorCallback) {
          this.onErrorCallback(error)
        }
        // 连接断开后，可以尝试重连
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          console.log('SSE 连接已关闭，尝试重连...')
          this.scheduleReconnect(userId)
        }
      }

      // 监听连接打开事件
      this.eventSource.onopen = () => {
        console.log('SSE 连接已建立')
        // 清除重连定时器
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer)
          this.reconnectTimer = null
        }
        if (this.onOpenCallback) {
          this.onOpenCallback()
        }
      }
    } catch (error) {
      console.error('建立 SSE 连接失败:', error)
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(userId: string | number) {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    this.reconnectTimer = window.setTimeout(() => {
      if (this.onMessageCallback) {
        this.connect(
          userId,
          this.onMessageCallback,
          this.onErrorCallback || undefined,
          this.onOpenCallback || undefined
        )
      }
    }, this.reconnectDelay)
  }

  /**
   * 关闭 SSE 连接
   */
  close() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      console.log('SSE 连接已关闭')
    }
    // 清空回调函数
    this.onMessageCallback = null
    this.onErrorCallback = null
    this.onOpenCallback = null
  }

  /**
   * 获取连接状态
   */
  getReadyState(): number | null {
    return this.eventSource?.readyState ?? null
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN
  }
}

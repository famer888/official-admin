import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

type IRequestConfig = {
  /** 是否手动触发 */
  manual?: boolean

  /** 防抖时间 */
  debounce?: number

  /** 成功回调 */
  onSuccess?: <T = any>(res: T) => void

  /** 失败回调 */
  onError?: <T = Error>(err: T) => void
}

type Response<T = any> = {
  code: number
  data: T
  msg: string
}

type RequestFn<T = any, U = any> = (params?: T) => Promise<Response<U>>

/**
 * 通用请求函数
 * @param fn 请求函数
 * @param config 请求配置
 * @returns {Object} { run, loading, data }
 */
export const useRequest = <T = any, U = any>(fn: RequestFn<T, U>, config?: IRequestConfig) => {
  const loading = ref(false)
  const data = ref<U | null>(null)

  const requestFn = async (params?: T) => {
    try {
      loading.value = true
      const res = await fn(params)
      loading.value = false

      if (res.code === 0) {
        config?.onSuccess?.(res.data)

        data.value = res.data
        return res
      } else {
        config?.onError?.(res)
        throw res
      }
    } catch (error) {
      config?.onError?.(error)
      loading.value = false
      data.value = null

      throw error
    } finally {
      loading.value = false
    }
  }

  const run = useDebounceFn(requestFn, config?.debounce || 0)

  if (!config?.manual) {
    run()
  }

  return {
    run,
    loading,
    data,
  }
}

import { isReactive, isRef } from 'vue'

function setLoading(loading, val) {
  if (loading != undefined && isRef(loading)) {
    loading.value = val
  } else if (loading != undefined && isReactive(loading)) {
    loading.loading = val
  }
}

const useAsync = async (
  func: () => Promise<any>,
  loading: any,
  successCallback: (() => void)[]
): Promise<any> => {
  try {
    setLoading(loading, true) // 设置 loading 为 true
    const res = await func() // 执行异步函数
    if (res?.code === 0) {
      $message.success('操作成功')
      await Promise.all(successCallback.map((cb) => Promise.resolve(cb())))
    }
    return res
  } catch (error) {
    console.log(error);
    
    $message.error('操作失败')
    throw error // 捕获错误并抛出，交给上层处理
  } finally {
    setLoading(loading, false) // 设置 loading 为 false
  }
}

export default useAsync

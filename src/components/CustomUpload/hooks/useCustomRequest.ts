import { UploadCustomRequestOptions } from 'naive-ui'
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import { Store } from 'pinia'
import { createAlova } from 'alova'
import { xhrRequestAdapter } from '@alova/adapter-xhr'
import { useGlobSetting } from '@/hooks/setting'
import { useUser } from '@/store/modules/user'

type CustomRequestProps = {
  /** 上传文件后, 回显到组件的 value */
  value: Ref<string | string[]>
  /** 公共提示函数对象 */
  message: MessageApiInjection
  /** 自定义上传请求配置 */
  options: UploadCustomRequestOptions
  /** 用户 store */
  userStore: Store
  /** 是否是多文件上传 */
  isMulti: boolean
  /** 上传接口路径 */
  action: string
}

const { apiUrl } = useGlobSetting()

// 创建 alova 实例，配置 XHR 适配器（关键：支持 onUpload 进度）
const alovaInstance = createAlova({
  baseURL: apiUrl, // 你的接口基础地址
  // 配置 XHR 适配器，替代默认的 Fetch 适配器
  requestAdapter: xhrRequestAdapter(),
  beforeRequest(method) {
    const userStore = useUser()
    const token = userStore.getToken
    method.config.headers['token'] = token
  },
  responded: {
    onSuccess: async (response) => {
      const blob = await response.data

      return blob
    },
  },
})

export const useCustomRequest = async ({
  value,
  message,
  options,
  isMulti,
  action,
}: CustomRequestProps) => {
  const { file, onProgress, onFinish, onError } = options
  const formData = new FormData()
  formData.append('file', file.file as File)

  try {
    const offset = alovaInstance.Post(action, formData, {
      responseType: 'json',
    })

    offset.onUpload((e) => {
      onProgress({ percent: (e.loaded / e.total) * 100 })
    })

    const res = (await offset) as Record<string, any>
    if (res.code === 0) {
      if (isMulti) {
        value.value = [...value.value, res.data]
      } else {
        value.value = res.data
      }

      onFinish()
      message.success('上传成功')
    } else {
      message.error(res?.msg || '上传失败')
      onError()
    }
  } catch (err) {
    console.log(err, 'get err')
    onError()
    message.error('上传响应解析失败')
  }
}

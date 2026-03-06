import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import adapterFetch from 'alova/fetch'
import { createAlovaMockAdapter } from '@alova/mock'
import { isString } from 'lodash-es'
import mocks from './mocks'
import { useUser } from '@/store/modules/user'
import { storage } from '@/utils/Storage'
import { useGlobSetting, useLocalSetting } from '@/hooks/setting'
import { PageEnum } from '@/enums/pageEnum'
import { ResultEnum } from '@/enums/httpEnum'
import { isUrl, encryptForJavaGcm, decryptFromJavaGcm, getBase64 } from '@/utils'
const { apiUrl, urlPrefix } = useGlobSetting()
const { useMock, loggerMock } = useLocalSetting()

const isEncrypt = !(import.meta.env.VITE_APP_ENV === 'development')
const isDev = import.meta.env.ENV
const keyBase64 = getBase64()
const proxyPrefixes = ['/admin-api/system/', '/admin-api/payment/', '/admin-api/report/']

const mockAdapter = createAlovaMockAdapter([...mocks], {
  // 全局控制是否启用mock接口，默认为true
  enable: useMock,

  // 非模拟请求适配器，用于未匹配mock接口时发送请求
  httpAdapter: adapterFetch({ credentials: 'include' }),

  // mock接口响应延迟，单位毫秒
  delay: 1000,

  mockRequestLogger: loggerMock,
  onMockError(error, currentMethod) {
    console.error('🚀 ~ onMockError ~ currentMethod:', currentMethod)
    console.error('🚀 ~ onMockError ~ error:', error)
  },
})

export const Alova = createAlova({
  baseURL: apiUrl,
  statesHook: VueHook,
  cacheLogger: false,
  requestAdapter: mockAdapter,
  beforeRequest: async (method) => {
    const userStore = useUser()
    const token = userStore.getToken

    // 全局携带 Cookie（同源场景下会自动带当前域的 cookie）
    method.config.credentials = 'include'

    // 添加 token 到请求头（Auth 请求跳过）
    if (!method.meta?.ignoreToken && token) {
      method.config.headers['token'] = token
    }

    // Auth 请求跳过 URL 处理，直接使用代理路径
    if (method.meta?.isAuthRequest) {
      return
    }

    // 非本地环境 cookie接口路径变更
    if (!isDev) {
      const hit = proxyPrefixes.find((prefix) => method.url.startsWith(prefix))
      if (hit) {
        // 保留原始路径中前缀之后的部分
        const restPath = method.url.slice(hit.length - 1) // 包含前面的 '/'
        method.url = `/proxy${restPath}`
      }
    }

    // 处理 api 请求前缀
    const isUrlStr = isUrl(method.url as string)
    if (!isUrlStr && urlPrefix) {
      method.url = `${urlPrefix}${method.url}`
    }
    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      method.url = `${apiUrl}${method.url}`
    }
    // ✅ 如果是下载请求，标记一下
    if (method.config.responseType === 'blob') {
      if (!method.meta) method.meta = {}
      method.meta.isDownload = true
    }

    if (method.type === 'POST' && isEncrypt) {
      const plaintext = JSON?.stringify(method.data)
      const encryptedBase64 = await encryptForJavaGcm(keyBase64, plaintext)
      method.data = encryptedBase64
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      // ⬇️ 1. 专门处理文件下载（Excel、PDF、ZIP等）
      if (method.meta?.isDownload || method.config.responseType === 'blob') {
        try {
          const blob = await response.blob()
          return {
            blob,
            headers: Object.fromEntries(response.headers.entries()),
          } // ✅ 直接返回 blob 给调用方
        } catch (e) {
          console.error('Blob 解析失败:', e)
          throw new Error('文件下载失败，请重试')
        }
      }
      let res = {}
      if (!isEncrypt) {
        res = (response.json && (await response.json())) || response.body
      } else {
        const resp = (response.json && (await response.json())) || response.body
        const json = await decryptFromJavaGcm(keyBase64, resp)
        res = JSON.parse(json)
      }
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (method.meta?.isReturnNativeResponse) {
        return res
      }
      // 请根据自身情况修改数据结构
      const { msg: message, code } = res

      // 不进行任何处理，直接返回
      // 用于需要直接获取 code、result、 message 这些信息时开启
      if (method.meta?.isTransformResponse === false) {
        return res.data
      }

      // @ts-ignore
      const Message = window.$message
      // @ts-ignore
      const Modal = window.$dialog

      if (ResultEnum.SUCCESS === code) {
        return res
      }

      const LoginPath = PageEnum.BASE_LOGIN

      if (
        ResultEnum.AUTH_FAILED === code ||
        ResultEnum.TOKEN_INVALID === code ||
        ResultEnum.TOKEN_EXPIRED === code ||
        ResultEnum.UNAUTHORIZED === code ||
        ResultEnum.NOT_LOGIN === code ||
        ResultEnum.EXPIRED === code
      ) {
        storage.clear()
        //开发环境不跳转
        if (isDev) {
          return
        }
        window.location.href = window.origin + '/auth'
      }

      // 需要登录
      if (code === 912) {
        Modal?.warning({
          title: '提示',
          content: '登录身份已失效，请重新登录!',
          okText: '确定',
          closable: false,
          maskClosable: false,
          onOk: async () => {
            storage.clear()
            window.location.href = LoginPath
          },
        })
      } else {
        // 可按需处理错误 一般情况下不是 912 错误，不一定需要弹出 message
        Message?.error(message)
        throw new Error(message)
      }
    },
  },
})

// 项目，多个不同 api 地址，可导出多个实例
// export const AlovaTwo = createAlova({
//   baseURL: 'http://localhost:9001',
// });

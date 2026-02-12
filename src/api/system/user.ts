import { Alova } from '@/utils/http/alova/index'

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return Alova.Get<InResult>('/admin-api/system/menu/getPermissionInfo', { cacheFor: null })
}
/**
 *
 * @param params auth 鉴权
 * @returns
 */
/**
 * @description: 通过 Auth 服务获取用户信息（携带 Cookie）
 */
export function getUserInfoByAuth() {
  const authUrl = import.meta.env.DEV
    ? '/auth-api/api/userinfo'
    : `${import.meta.env.VITE_GLOB_AUTH_API_URL}/api/userinfo`

  return Alova.Get<InResult>(authUrl, {
    cacheFor: null,
    meta: {
      includeCredentials: true, // 标记需要携带 Cookie
      ignoreToken: true, // 忽略 token，使用 Cookie 认证
      isAuthRequest: true, // 标记这是 Auth 请求，避免 URL 被处理
    },
  })
}
/**
 *
 * @param params 退出登录
 * @returns
 */
export function logoutAuth() {
  const authUrl = import.meta.env.DEV
    ? '/auth-api/api/logout'
    : `${import.meta.env.VITE_GLOB_AUTH_API_URL}/api/logout`
  return Alova.Get(authUrl, {
    cacheFor: null,
    meta: {
      includeCredentials: true, // 标记需要携带 Cookie
      ignoreToken: true, // 忽略 token，使用 Cookie 认证
      isAuthRequest: true, // 标记这是 Auth 请求，避免 URL 被处理
    },
  })
}

/* 用户登录 */
export function login(params) {
  return Alova.Post('/admin-api/auth/v1/user/login', params)
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return Alova.Post(`/user/u${uid}/changepw`, { params })
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return Alova.Post('/admin-api/auth/v1/ad/user/loginOut', {
    params,
  })
}

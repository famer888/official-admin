import { Alova } from '@/utils/http/alova/index'

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return Alova.Get<InResult>('/admin-api/system/menu/getPermissionInfo', { cacheFor: null })
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

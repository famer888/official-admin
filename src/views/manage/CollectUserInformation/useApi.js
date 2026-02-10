import { Alova } from '@/utils/http/alova/index'

/* 完善用户信息 */
export function completeUserDetail(params) {
  return Alova.Post('/admin-api/system/user/completeUserDetail', params)
}

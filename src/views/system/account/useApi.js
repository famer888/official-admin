import { Alova } from '@/utils/http/alova/index'

/* 列表 */
export function page(params) {
  return Alova.Post('/admin-api/system/user/getUserPage', params)
}

/* 查看google密钥 */
export function getGoogleKey(params) {
  return Alova.Get('/admin-api/system/user/getGoogleKey', { params })
}

/* 新增 */
export function add(params) {
  return Alova.Post('/admin-api/system/user/create', params)
}

/* 编辑 */
export function update(params) {
  return Alova.Post('/admin-api/system/user/editUser', params)
}

/* 删除 */
export function del(params) {
  return Alova.Get('/admin-api/system/user/delete', { params })
}

/* 更新用户状态 */
export function updateUserStatus(params) {
  return Alova.Post('/admin-api/system/user/updateUserStatus', params)
}

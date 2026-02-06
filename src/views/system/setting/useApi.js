import { Alova } from '@/utils/http/alova/index'

/* 列表 */
export function page(params) {
  return Alova.Post('/admin-api/system/config/getConfigPage', params)
}

/* 新增 */
export function add(params) {
  return Alova.Post('/admin-api/system/config/addConfig', params)
}

/* 编辑 */
export function update(params) {
  return Alova.Post('/admin-api/system/config/editConfig', params)
}

/* 删除 */
export function del(id) {
  return Alova.Post('/admin-api/system/config/delete/' + id)
}

import { Alova } from '@/utils/http/alova/index'

/* 列表 */
export function page(params) {
  return Alova.Post('/admin-api/system/role/getRolePage', params)
}

/* 新增 */
export function add(params) {
  return Alova.Post('/admin-api/system/role/addRole', params)
}

/* 编辑 */
export function update(params) {
  return Alova.Post('/admin-api/system/role/editRole', params)
}

/* 删除 */
export function del(params) {
  return Alova.Get('/admin-api/system/role/deleteRole', { params })
}

/* 更新角色状态 */
export function updateRoleStatus(params) {
  return Alova.Post('/admin-api/system/role/updateRoleStatus', params)
}

/* 获取功能权限 */
export function getMenuTree(params) {
  return Alova.Get('/admin-api/system/role/getMenuTree', { params, cacheFor: null })
}

/* 更新功能权限 */
export function updateMenuTree(params) {
  return Alova.Post('/admin-api/system/role/updateMenuTree', params)
}

/* 获取数据权限 */
export function getDataScope(params) {
  return Alova.Get('/admin-api/system/role/getDataScope', { params, cacheFor: null })
}

/* 更新数据权限 */
export function updateDataScope(params) {
  return Alova.Post('/admin-api/system/role/updateDataScope', params)
}

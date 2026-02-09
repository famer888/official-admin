import { Alova } from '@/utils/http/alova/index'

/**
 * @description: 获取App应用列表下拉框
 */
export function appDownBox(params) {
  return Alova.Get<InResult>('/admin-api/system/common/appDownBox', { params })
}

/**
 * @description: 获取指定类型下拉框
 */
export function getDownBoxByType(params) {
  return Alova.Get<InResult>('/admin-api/system/common/getDownBoxByType', {
    params,
    cacheFor: null,
  })
}

/* 获取角色列表 */
export function getRoleDownBox() {
  return Alova.Get('/admin-api/system/common/roleDownBox', { cacheFor: null })
}

/* 获取事业部列表 */
export function getDeptDownBox() {
  return Alova.Get('/admin-api/system/common/deptDownBox', { cacheFor: null })
}

/* 根据类型获取下拉列表 */
export function getAllOptions(params) {
  return Alova.Post('/admin-api/system/common/getAllOptions', params)
}

/* 收款方式 */
export function getPayTypeDownBox() {
  return Alova.Get('/admin-api/system/common/payTypeDownBox', { cacheFor: null })
}

/* 获取广告模式下拉框 */
export function getAdvertiseModeDownBox() {
  return Alova.Get('/admin-api/system/common/advertiseModeDownBox', { cacheFor: null })
}

/* 文件上传 */
export function uploadFile(params, config = {}) {
  return Alova.Post('/admin-api/system/common/uploadFile', params, { ...config })
}

/* 获取客户列表下拉框 */
export function customerDownBox(params) {
  return Alova.Get('/admin-api/system/common/customerDownBox', { params, cacheFor: null })
}

/* 获取广告素材类型枚举列表 */
export function getAdMaterialTypeList(params) {
  return Alova.Get('/admin-api/system/common/getAdMaterialTypeList', { params, cacheFor: null })
}

/* 获取内部路由页面类型下拉框 */
export function pageTypeDownBox(params) {
  return Alova.Get('/admin-api/system/common/pageTypeDownBox', { params, cacheFor: null })
}

/* 获取APP访问类型 */
export function getAccessTypeDownBox(params) {
  return Alova.Get('/admin-api/system/common/getAccessTypeDownBox', params)
}

/* 分页查询广告超市配置列表 */
export function getAdvertiseSupermarketPage(params) {
  return Alova.Post('/admin-api/system/advertiseSupermarket/getAdvertiseSupermarketPage', params)
}
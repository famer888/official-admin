import { Alova } from '@/utils/http/alova/index'

/* 获取用户详情 */
export function getUserInfo() {
  return Alova.Get('/admin-api/system/user/getUserDetail', { cacheFor: null })
}

/* 更新个人信息 */
export function updateUserInfo(params) {
  return Alova.Post('/admin-api/system/user/completeUserDetail', params)
}

/* 修改密码 */
export function changePassword(params) {
  return Alova.Post('/admin-api/system/user/modifyPassword', params)
}

/* 获取消息列表 */
export function getMessageList(params) {
  return Alova.Post('/admin-api/system/message/queryPage', params)
}

/* 获取未读消息数量 */
export function getUnreadCount() {
  return Alova.Get('/admin-api/system/message/unreadCount', { cacheFor: null })
}

/* 标记消息为已读 */
export function markMessageRead(params) {
  return Alova.Post('/admin-api/system/message/markRead', params)
}

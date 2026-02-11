import { Alova } from '@/utils/http/alova/index'

/* 获取用户详情 */
export function getUserInfo() {
  return Alova.Get('/admin-api/system/user/getUserDetail')
}

/* 更新个人信息 */
export function updateUserInfo(params) {
  return Alova.Post('/user/updateUserInfo', params)
}

/* 修改密码 */
export function changePassword(params) {
  return Alova.Post('/user/changePassword', params)
}

/* 获取消息列表 */
export function getMessageList(params) {
  return Alova.Post('/user/getMessageList', params)
}

/* 标记消息为已读 */
export function markMessageRead(params) {
  return Alova.Post('/user/markMessageRead', params)
}

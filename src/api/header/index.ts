import { Alova } from '@/utils/http/alova/index'

/**
 * @description: 获取未读消息数量
 */
export function getUnreadMessageCount() {
    return Alova.Get('/admin-api/system/message/unreadCount', { cacheFor: null })
}

/**
 * @description: 获取未读消息列表
 */
export function getUnreadMessageList() {
    return Alova.Get('/admin-api/system/message/unreadList', { cacheFor: null })
}

/**
 * @description: 标记消息为已读
 * @param params { messageIds: number[], userId?: number, creator?: string }
 */
export function markMessageRead(params) {
    return Alova.Post('/admin-api/system/message/markRead', params)
}

/**
 * @description: 获取广告经理信息
 */
export function getAdManager() {
    return Alova.Get('/admin-api/system/user/adManager', { cacheFor: null })
}


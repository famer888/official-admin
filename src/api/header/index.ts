import { Alova } from '@/utils/http/alova/index'

/**
 * @description: 获取未读消息数量
 */
export function getUnreadMessageCount() {
    return Alova.Get('/admin-api/system/message/unreadCount')
}


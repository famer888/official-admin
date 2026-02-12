<template>
  <div class="messages">
    <n-list v-if="messageList.length">
      <n-list-item v-for="item in messageList" :key="item.messageId">
        <div class="message-item" @click="handleMarkRead(item)">
          <div class="message-icon">
            <img :src="getMessageType(item.bizType)" />
          </div>
          <div class="message-content">
            <div class="message-text">{{ item.message }}</div>
            <div class="message-status" :class="item.isRead === 1 ? 'read' : 'unread'">
              {{ item.isRead === 1 ? '已读' : '未读' }}
            </div>
          </div>
        </div>
      </n-list-item>
    </n-list>

    <n-empty v-if="!messageList.length" description="暂无消息" />

    <n-pagination
      v-model:page="messageParams.pageNo"
      v-model:page-size="messageParams.pageSize"
      :item-count="messageTotal"
      :page-sizes="[10, 20, 50]"
      show-size-picker
      @update:page="loadMessages"
      @update:page-size="loadMessages"
      class="pagination"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { getMessageList, markMessageRead, getUnreadCount } from '../useApi'
  import { WarningOutlined, InfoCircleOutlined, BellOutlined } from '@vicons/antd'
  import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
  import msgType from '@/assets/svgIcon/msg-type.svg'
  import msgType1 from '@/assets/svgIcon/msg-type2.svg'
  import msgType2 from '@/assets/svgIcon/msg-type3.svg'
  const emit = defineEmits(['update:unread-count'])

  const messageList = ref([])
  const messageTotal = ref(0)
  const unreadCount = ref(0)
  const messageParams = ref({
    pageNo: 1,
    pageSize: 10,
  })

  // 根据 bizType 获取消息类型
  const getMessageType = (bizType) => {
    let iconMap = {
      1: msgType,
      2: msgType1,
      3: msgType2,
    }
    return iconMap[bizType]
  }

  // 加载未读消息数量
  const loadUnreadCount = async () => {
    try {
      const res = await getUnreadCount()
      if (res?.code === 0) {
        unreadCount.value = res.data || 0
        emit('update:unread-count', unreadCount.value)
      }
    } catch (error) {
      console.error('加载未读消息数量失败：', error)
    }
  }

  // 加载消息列表
  const loadMessages = async () => {
    try {
      const res = await getMessageList({
        ...messageParams.value,
      })
      if (res?.code === 0) {
        messageList.value = res.data?.dataList || []
        messageTotal.value = res.data?.total || 0
        // 加载未读数量
        await loadUnreadCount()
      }
    } catch (error) {
      console.error('加载消息列表失败：', error)
    }
  }

  // 标记消息为已读
  const handleMarkRead = async (item) => {
    if (item.isRead === 1) return
    try {
      const res = await markMessageRead({ messageIds: [item.messageId] })
      if (res?.code === 0) {
        item.isRead = 1
        unreadCount.value = Math.max(0, unreadCount.value - 1)
        emit('update:unread-count', unreadCount.value)
        // 重新加载未读数量
        await loadUnreadCount()
      }
    } catch (error) {
      console.error('标记消息已读失败：', error)
    }
  }

  // 获取未读消息数量
  const getUnreadCountValue = async () => {
    await loadUnreadCount()
    return unreadCount.value
  }

  // 暴露方法供父组件调用
  defineExpose({
    loadMessages,
    getUnreadCount: getUnreadCountValue,
  })

  // 初始化加载
  onMounted(() => {
    loadMessages()
  })
</script>

<style lang="less" scoped>
  .messages {
    padding: 20px 0;

    .message-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid #ebeef5;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }

      .message-icon {
        margin-right: 12px;
        margin-top: 2px;
      }

      .message-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .message-text {
          flex: 1;
          color: #606266;
          line-height: 1.5;
        }

        .message-status {
          margin-left: 16px;
          font-size: 12px;

          &.read {
            color: #67c23a;
          }

          &.unread {
            color: #f56c6c;
            font-weight: 500;
          }
        }
      }
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>

<template>
  <div class="messages">
    <n-list v-if="messageList.length">
      <n-list-item v-for="item in messageList" :key="item.id">
        <div class="message-item" @click="handleMarkRead(item)">
          <div class="message-icon">
            <n-icon
              :size="24"
              :color="getMessageIconColor(item.type)"
              v-if="item.type === 'warning'"
            >
              <WarningOutlined />
            </n-icon>
            <n-icon :size="24" color="#18a058" v-else-if="item.type === 'info'">
              <InfoCircleOutlined />
            </n-icon>
            <n-icon :size="24" color="#2080f0" v-else>
              <BellOutlined />
            </n-icon>
          </div>
          <div class="message-content">
            <div class="message-text">{{ item.content }}</div>
            <div class="message-status" :class="item.isRead ? 'read' : 'unread'">
              {{ item.isRead ? '已读' : '未读' }}
            </div>
          </div>
        </div>
      </n-list-item>
    </n-list>

    <n-empty v-if="!messageList.length" description="暂无消息" />

    <n-pagination
      v-model:page="messageParams.page"
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
  import { ref } from 'vue'
  import { getMessageList, markMessageRead } from '../useApi'
  import { WarningOutlined, InfoCircleOutlined, BellOutlined } from '@vicons/antd'

  const emit = defineEmits(['update:unread-count'])

  const messageList = ref([])
  const messageTotal = ref(0)
  const unreadCount = ref(0)
  const messageParams = ref({
    page: 1,
    pageSize: 10,
  })

  // 获取消息图标颜色
  const getMessageIconColor = (type) => {
    return type === 'warning' ? '#f53f3f' : '#18a058'
  }

  // 加载消息列表
  const loadMessages = async () => {
    try {
      const res = await getMessageList(messageParams.value)
      if (res?.code === 0) {
        messageList.value = res.data?.list || []
        messageTotal.value = res.data?.total || 0
        unreadCount.value = res.data?.unreadCount || 0
        emit('update:unread-count', unreadCount.value)
      }
    } catch (error) {
      console.error('加载消息列表失败：', error)
    }
  }

  // 标记消息为已读
  const handleMarkRead = async (item) => {
    if (item.isRead) return
    try {
      const res = await markMessageRead({ id: item.id })
      if (res?.code === 0) {
        item.isRead = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
        emit('update:unread-count', unreadCount.value)
        loadMessages()
      }
    } catch (error) {
      console.error('标记消息已读失败：', error)
    }
  }

  // 获取未读消息数量
  const getUnreadCount = async () => {
    return unreadCount.value
  }

  // 暴露方法供父组件调用
  defineExpose({
    loadMessages,
    getUnreadCount,
  })

  // 初始化加载
  loadMessages()
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

<template>
  <div class="py-5">
    <n-list v-if="messageList.length">
      <n-list-item v-for="item in messageList" :key="item.messageId">
        <div
          class="flex px-4 items-start py-3 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50"
          @click="handleMarkRead(item)"
        >
          <div class="mr-3 mt-0.5 shrink-0">
            <img :src="getMessageType(item.bizType)" />
          </div>
          <div class="flex-1 flex justify-between items-center min-w-0">
            <div class="flex-1 text-gray-600 leading-relaxed">{{ item.message }}</div>
            <div
              class="ml-4 text-xs shrink-0"
              :class="item.isRead === 1 ? 'text-green-600' : 'text-red-500 font-medium'"
            >
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
      class="mt-5 flex justify-end"
      @update:page="loadMessages"
      @update:page-size="loadMessages"
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

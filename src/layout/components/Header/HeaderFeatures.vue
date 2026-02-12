<template>
  <div class="relative flex items-center h-16" ref="headerFeaturesRef">
    <!-- 站内消息 -->
    <div class="relative" ref="messageTriggerRef">
      <div class="flex flex-col items-center justify-center px-3 py-2 cursor-pointer rounded transition-all relative hover:bg-white/8" @click="handleMessageClick">
        <div class="relative w-[29px] h-[29px] flex items-center justify-center mb-1">
          <img :src="layout1Icon" alt="站内消息" class="w-[29px] h-[29px] block" />
          <n-badge 
            :value="state.messageCount" 
            :max="99" 
            class="absolute message-badge"
            :class="{ 'message-badge-double': state.messageCount >= 10 }"
          />
        </div>
        <span class="text-xs leading-tight whitespace-nowrap text-[#455980] transition-colors" :class="{ 'text-[#3A82F9]': activeFeature === 'message' }">站内消息</span>
      </div>
      
      <!-- 消息弹窗 -->
      <div 
        v-if="showMessagePopover" 
        ref="messagePopoverRef"
        class="absolute top-full left-1/2 -translate-x-1/2 w-[290px] bg-white rounded-lg shadow-lg overflow-hidden z-[1000] mt-2 flex flex-col"
        @click.stop
      >
        <!-- 消息列表 -->
        <div class="max-h-[300px] overflow-y-auto p-0">
          <div v-if="loadingMessages" class="py-10 px-5 text-center text-[#86909c] text-sm">
            加载中...
          </div>
          <template v-else>
            <div
              v-for="(msg, index) in displayedMessages"
              :key="msg.messageId || index"
              class="flex items-center h-[46px] px-4 border-b border-[#DEE9FF] cursor-pointer transition-colors last:border-b-0"
              :class="{ 'bg-[#DEE9FF]': selectedMessageIndex === index || hoveredMessageIndex === index }"
              @click="handleMessageItemClick(index)"
              @mouseenter="hoveredMessageIndex = index"
              @mouseleave="hoveredMessageIndex = -1"
            >
              <div class="w-7 h-7 flex-shrink-0 flex items-center justify-center mr-[7px]">
                <img src="@/assets/images/money.svg" alt="icon" class="w-6 h-6" />
              </div>
              <div class="flex-1 min-w-0 overflow-hidden flex items-center">
                <div class="text-[15px] font-medium leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis" :class="selectedMessageIndex === index || hoveredMessageIndex === index ? 'text-[#3A82F9]' : 'text-[#455980]'">{{ msg.message }}</div>
              </div>
            </div>
            <div v-if="state.messages.length === 0" class="py-10 px-5 text-center text-[#86909c] text-sm">
              暂无消息
            </div>
          </template>
        </div>
        
        <!-- 底部信息 -->
        <div class="py-3 px-4 border-t border-[#f0f0f0] flex flex-col items-center justify-center bg-white">
          <div class="text-[13px] text-[#86909c] mb-3">共有{{ state.total }}条未读消息</div>
          <button
            v-if="state.total > 0"
            @click="toggleShowAll"
            class="w-[192px] h-10 bg-[#3A82F9] border-none text-white text-sm rounded cursor-pointer transition-opacity outline-none hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
            :disabled="loadingMessages"
          >
            {{ loadingMessages ? '加载中...' : '查看全部消息' }}
          </button>
        </div>
      </div>
    </div>
    <div class="w-px h-10 bg-[#DEE5EE] mx-1"></div>
    <!-- USD余额 -->
    <div class="flex flex-col items-center justify-center px-3 py-2 cursor-pointer rounded transition-all relative hover:bg-white/8">
      <div class="relative w-[29px] h-[29px] flex items-center justify-center mb-1">
        <img :src="layout2Icon" alt="USD余额" class="w-[29px] h-[29px] block" />
      </div>
      <span class="text-xs leading-tight whitespace-nowrap text-[#EB445A] transition-colors">USD:{{ state.usdBalance }}</span>
    </div>
    <div class="w-px h-10 bg-[#DEE5EE] mx-1"></div>
    <!-- 用户ID -->
    <div class="flex flex-col items-center justify-center px-3 py-2 cursor-pointer rounded transition-all relative hover:bg-white/8">
      <div class="relative w-[29px] h-[29px] flex items-center justify-center mb-1">
        <img :src="layout3Icon" alt="用户ID" class="w-[29px] h-[29px] block" />
      </div>
      <span class="text-xs leading-tight whitespace-nowrap text-[#455980] transition-colors" :class="{ 'text-[#3A82F9]': activeFeature === 'userId' }">ID:{{ state.userId }}</span>
    </div>
    <div class="w-px h-10 bg-[#DEE5EE] mx-1"></div>
    <!-- 常见问题 -->
    <div class="relative" ref="faqTriggerRef">
      <div class="flex flex-col items-center justify-center px-3 py-2 cursor-pointer rounded transition-all relative hover:bg-white/8" @click="handleFaqClick">
        <div class="relative w-[29px] h-[29px] flex items-center justify-center mb-1">
          <img :src="layout4Icon" alt="常见问题" class="w-[29px] h-[29px] block" />
        </div>
        <span class="text-xs leading-tight whitespace-nowrap text-[#455980] transition-colors" :class="{ 'text-[#3A82F9]': activeFeature === 'faq' }">常见问题</span>
      </div>
    </div>
    <div class="w-px h-10 bg-[#DEE5EE] mx-1"></div>
    <!-- 登出 -->
    <div class="flex flex-col items-center justify-center px-3 py-2 cursor-pointer rounded transition-all relative hover:bg-white/8" @click="handleLogout">
      <div class="relative w-[29px] h-[29px] flex items-center justify-center mb-1">
        <img :src="layout5Icon" alt="登出" class="w-[29px] h-[29px] block" />
      </div>
      <span class="text-xs leading-tight whitespace-nowrap text-[#455980] transition-colors" :class="{ 'text-[#3A82F9]': activeFeature === 'logout' }">登出</span>
    </div>
    
    <!-- 常见问题弹窗 - 相对于整个容器居中 -->
    <div 
      v-if="showFaqPopover" 
      ref="faqPopoverRef"
      class="absolute top-full left-1/2 -translate-x-1/2 z-[1000] mt-2 flex items-center justify-center"
      @click.stop
    >
      <button class="w-[180px] h-[47px] bg-[#3A82F9] border-none text-white text-base rounded cursor-pointer outline-none flex items-center justify-center gap-1.5 focus:outline-none shadow-lg" @click="goToHelpCenter">
        前往帮助中心
        <img :src="helpCenterIcon" alt="icon" class="w-7 h-7 flex-shrink-0" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { NBadge, useMessage } from 'naive-ui'
import layout1Icon from '@/assets/images/layout/layout1.svg'
import layout2Icon from '@/assets/images/layout/layout2.svg'
import layout3Icon from '@/assets/images/layout/layout3.svg'
import layout4Icon from '@/assets/images/layout/layout4.svg'
import layout5Icon from '@/assets/images/layout/layout5.svg'
import helpCenterIcon from '@/assets/images/msg-type4.svg'
import { getUnreadMessageCount, getUnreadMessageList, markMessageRead } from '@/api/header'
import { getUserInfo } from '@/api/system/user'
import { SSEManager } from '@/utils/sse'
import { useGlobSetting } from '@/hooks/setting'

const emit = defineEmits(['logout'])

const router = useRouter()
const message = useMessage()
const { apiUrl, urlPrefix } = useGlobSetting()
const sseManager = new SSEManager(apiUrl, urlPrefix)

const showMessagePopover = ref(false)
const showAllMessages = ref(false)
const loadingMessages = ref(false)
const messageTriggerRef = ref(null)
const messagePopoverRef = ref(null) // 消息弹窗的引用
const selectedMessageIndex = ref(-1)
const hoveredMessageIndex = ref(-1) // 当前 hover 的消息项索引
const activeFeature = ref('') // 当前激活的功能项
const showFaqPopover = ref(false)
const faqTriggerRef = ref(null)
const faqPopoverRef = ref(null) // 常见问题弹窗的引用
const headerFeaturesRef = ref(null) // 整个 header-features 容器的引用

const state = reactive({
  messageCount: 0,
  usdBalance: '0.00',
  userId: '',
  messages: [],
  total: 0, // 消息总数
})

// 计算显示的消息列表
const displayedMessages = computed(() => {
  if (showAllMessages.value) {
    return state.messages
  }
  return state.messages.slice(0, 5)
})

// 获取未读消息数量
const fetchUnreadMessageCount = async () => {
  try {
    const res = await getUnreadMessageCount()
    // 更新未读消息数量
    if (res?.data !== undefined) {
      state.messageCount = res.data
    }
  } catch (error) {
    console.error('获取未读消息数量失败:', error)
  }
}

// 建立 SSE 订阅连接
const initSSEConnection = async () => {
  try {
    // 获取用户信息，从中获取 userId 和 balance
    const res = await getUserInfo()
    const userId = res?.data?.user?.userId
    const balance = res?.data?.user?.balance
    
    if (!userId) {
      console.warn('用户ID不存在，无法建立 SSE 连接')
      return
    }

    // 更新余额和用户ID
    if (balance !== undefined) {
      state.usdBalance = typeof balance === 'number' ? balance.toFixed(2) : balance
    }
    if (userId) {
      state.userId = userId
    }

    // 消息处理回调
    const handleMessage = (data) => {
      // 如果是新消息推送，只刷新未读消息数量
      if (data.cmd === 'newMessage') {
        // 调用接口刷新未读消息数量
        fetchUnreadMessageCount()
      } 
    }

    // 建立连接
    sseManager.connect(userId, handleMessage)
  } catch (error) {
    console.error('获取用户信息失败，无法建立 SSE 连接:', error)
  }
}

// 关闭 SSE 连接
const closeSSEConnection = () => {
  sseManager.close()
}

// 获取未读消息列表
const fetchMessageList = async () => {
  try {
    loadingMessages.value = true
    const res = await getUnreadMessageList()
    if (res?.data) {
      // 新接口返回的数据结构：data.unreadCount 和 data.latestUnreadMessages
      const messages = res.data.latestUnreadMessages || []
      const total = res.data.unreadCount || 0
      
      state.messages = messages
      state.total = total
      
      // 如果有新消息，调用标记已读接口
      if (messages.length > 0 && state.userId) {
        try {
          const messageIds = messages.map(msg => msg.messageId).filter(id => id != null)
          if (messageIds.length > 0) {
            await markMessageRead({
              messageIds: messageIds,
              userId: state.userId
            })
          }
        } catch (error) {
          console.error('标记消息为已读失败:', error)
          // 标记已读失败不影响消息列表显示，只记录错误
        }
      }
    }
  } catch (error) {
    console.error('获取消息列表失败:', error)
    state.messages = []
    state.total = 0
  } finally {
    loadingMessages.value = false
  }
}

// 切换显示全部消息 - 跳转到消息页面
const toggleShowAll = () => {
  // 关闭弹窗
  showMessagePopover.value = false
  // 跳转到个人中心的消息页面
  router.push({
    name: 'center',
    query: {
      tab: 'messages',
      type: 2
    }
  })
}

// 处理消息点击
const handleMessageClick = (e) => {
  e.stopPropagation()
  // 关闭其他弹窗
  showFaqPopover.value = false
  
  if (!showMessagePopover.value) {
    // 立即打开弹窗
    showMessagePopover.value = true
    showAllMessages.value = false
    selectedMessageIndex.value = -1
    activeFeature.value = 'message'
    // 获取消息列表（不等待，loading 会在 fetchMessageList 中控制）
    fetchMessageList()
  } else {
    // 如果弹窗已打开，关闭弹窗
    showMessagePopover.value = false
    activeFeature.value = ''
  }
}

// 处理消息项点击
const handleMessageItemClick = (index) => {
  selectedMessageIndex.value = index
}

// 处理常见问题点击
const handleFaqClick = (e) => {
  e.stopPropagation()
  if (!showFaqPopover.value) {
    // 关闭其他弹窗
    showMessagePopover.value = false
    showFaqPopover.value = true
    activeFeature.value = 'faq'
  } else {
    showFaqPopover.value = false
    activeFeature.value = ''
  }
}

// 跳转到官网帮助中心页
const goToHelpCenter = () => {
  const { VITE_WEBSITE_URL } = import.meta.env
  window.open(VITE_WEBSITE_URL + '/contact/help-center', '_blank')
}

// 处理登出
const handleLogout = () => {
  activeFeature.value = 'logout'
  emit('logout')
}

// 点击外部关闭弹窗
const handleClickOutside = (e) => {
  // 检查消息弹窗：点击目标不在触发区域和弹窗内时关闭
  if (showMessagePopover.value) {
    const isClickInMessageTrigger = messageTriggerRef.value && messageTriggerRef.value.contains(e.target)
    const isClickInMessagePopover = messagePopoverRef.value && messagePopoverRef.value.contains(e.target)
    if (!isClickInMessageTrigger && !isClickInMessagePopover) {
      showMessagePopover.value = false
      if (activeFeature.value === 'message') {
        activeFeature.value = ''
      }
    }
  }
  
  // 检查常见问题弹窗：点击目标不在触发区域和弹窗内时关闭
  if (showFaqPopover.value) {
    const isClickInFaqTrigger = faqTriggerRef.value && faqTriggerRef.value.contains(e.target)
    const isClickInFaqPopover = faqPopoverRef.value && faqPopoverRef.value.contains(e.target)
    if (!isClickInFaqTrigger && !isClickInFaqPopover) {
      showFaqPopover.value = false
      if (activeFeature.value === 'faq') {
        activeFeature.value = ''
      }
    }
  }
}

// 组件挂载时获取未读消息数量并建立 SSE 连接
onMounted(() => {
  fetchUnreadMessageCount()
  initSSEConnection()
  // 监听点击外部事件
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时关闭 SSE 连接
onUnmounted(() => {
  closeSSEConnection()
  // 移除点击外部事件监听
  document.removeEventListener('click', handleClickOutside)
})

// 暴露给父组件的数据
defineExpose({
  messageCount: computed(() => state.messageCount),
  usdBalance: computed(() => state.usdBalance),
  userId: computed(() => state.userId),
})
</script>

<style lang="less" scoped>
.message-badge {
  top: -6px !important;
  right: -6px !important;
  
  :deep(.n-badge-sup) {
    min-width: 18px !important;
    height: 18px !important;
    border-radius: 9px !important;
    padding: 0 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    
    .n-badge-sup__content {
      font-size: 11px !important;
      line-height: 1 !important;
    }
  }
  
  &.message-badge-double {
    :deep(.n-badge-sup) {
      min-width: 18px !important;
      max-width: 18px !important;
      width: 18px !important;
      padding: 0 2px !important;
      
      .n-badge-sup__content {
        font-size: 9px !important;
        line-height: 1 !important;
      }
    }
  }
}
</style>



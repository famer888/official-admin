<template>
  <div class="header-features">
    <!-- 站内消息 -->
    <div class="message-trigger-wrapper" ref="messageTriggerRef">
      <div class="header-feature-item" @click="handleMessageClick">
        <div class="feature-icon-wrapper">
          <img :src="layout1Icon" alt="站内消息" class="feature-icon-img" />
          <n-badge :value="state.messageCount" :max="99" class="feature-badge" />
        </div>
        <span class="feature-text" :class="{ 'active': activeFeature === 'message' }">站内消息</span>
      </div>
      
      <!-- 消息弹窗 -->
      <div 
        v-if="showMessagePopover" 
        class="message-popover-content"
        @click.stop
      >
        <!-- 消息列表 -->
        <div class="message-list">
          <div v-if="loadingMessages" class="message-loading">
            加载中...
          </div>
          <template v-else>
            <div
              v-for="(msg, index) in displayedMessages"
              :key="msg.messageId || index"
              class="message-item"
              :class="{ 'active': selectedMessageIndex === index }"
              @click="handleMessageItemClick(index)"
            >
              <div class="message-icon">
                <img src="@/assets/images/money.svg" alt="icon" />
              </div>
              <div class="message-content">
                <div class="message-text">{{ msg.message }}</div>
              </div>
            </div>
            <div v-if="state.messages.length === 0" class="message-empty">
              暂无消息
            </div>
          </template>
        </div>
        
        <!-- 底部信息 -->
        <div class="message-footer">
          <div class="message-count">共有{{ state.total }}条未读消息</div>
          <button
            v-if="state.total > 0"
            @click="toggleShowAll"
            class="view-all-btn"
            :disabled="loadingMessages"
          >
            {{ loadingMessages ? '加载中...' : '查看全部消息' }}
          </button>
        </div>
      </div>
    </div>
    <div class="feature-divider"></div>
    <!-- USD余额 -->
    <div class="header-feature-item">
      <div class="feature-icon-wrapper">
        <img :src="layout2Icon" alt="USD余额" class="feature-icon-img" />
      </div>
      <span class="feature-text feature-text-red">USD:{{ state.usdBalance }}</span>
    </div>
    <div class="feature-divider"></div>
    <!-- 用户ID -->
    <div class="header-feature-item">
      <div class="feature-icon-wrapper">
        <img :src="layout3Icon" alt="用户ID" class="feature-icon-img" />
      </div>
      <span class="feature-text feature-text-blue">ID:{{ state.userId }}</span>
    </div>
    <div class="feature-divider"></div>
    <!-- 常见问题 -->
    <div class="faq-trigger-wrapper" ref="faqTriggerRef">
      <div class="header-feature-item" @click="handleFaqClick">
        <div class="feature-icon-wrapper">
          <img :src="layout4Icon" alt="常见问题" class="feature-icon-img" />
        </div>
        <span class="feature-text" :class="{ 'active': activeFeature === 'faq' }">常见问题</span>
      </div>
      
      <!-- 常见问题弹窗 -->
      <div 
        v-if="showFaqPopover" 
        class="faq-popover-content"
        @click.stop
      >
        <button class="help-center-btn" @click="goToHelpCenter">
          前往帮助中心
        </button>
      </div>
    </div>
    <div class="feature-divider"></div>
    <!-- 登出 -->
    <div class="header-feature-item" @click="handleLogout">
      <div class="feature-icon-wrapper">
        <img :src="layout5Icon" alt="登出" class="feature-icon-img" />
      </div>
      <span class="feature-text" :class="{ 'active': activeFeature === 'logout' }">登出</span>
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
import { getUnreadMessageCount } from '@/api/header'
import { getMessageList } from '@/views/profile/useApi'
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
const selectedMessageIndex = ref(-1)
const activeFeature = ref('') // 当前激活的功能项
const showFaqPopover = ref(false)
const faqTriggerRef = ref(null)

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
      console.log('收到 SSE 推送消息:', data)
      
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

// 获取消息列表（固定参数：pageSize: 5, pageNo: 1）
const fetchMessageList = async () => {
  try {
    loadingMessages.value = true
    const res = await getMessageList({
      pageNo: 1,
      pageSize: 5,
    })
    
    if (res?.data) {
      let messages = res.data.dataList || []
      const total = res.data.total || 0
      
      // 如果数据不足5条，添加假数据
      if (messages.length < 5) {
        const fakeMessages = [
          {
            messageId: 'fake-1',
            title: '请注意! 您的预存款项已不足',
            message: '10 USD',
            bizType: 1,
            isRead: 0,
            createTime: new Date().toISOString(),
          },
          {
            messageId: 'fake-2',
            title: '请注意! 您的预存款项已不足',
            message: '100 USD',
            bizType: 1,
            isRead: 0,
            createTime: new Date().toISOString(),
          },
          {
            messageId: 'fake-3',
            title: '请注意! 您的竞价排名已不是最高',
            message: '您的竞价排名已不是最高',
            bizType: 2,
            isRead: 0,
            createTime: new Date().toISOString(),
          },
          {
            messageId: 'fake-4',
            title: '广告活动"AXX"已经开始',
            message: '广告活动"AXX"已经开始',
            bizType: 3,
            isRead: 0,
            createTime: new Date().toISOString(),
          },
        ]
        
        // 补充假数据到5条
        const needCount = 5 - messages.length
        messages = [...messages, ...fakeMessages.slice(0, needCount)]
      }
      
      state.messages = messages
      state.total = total
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
      tab: 'messages'
    }
  })
}

// 处理消息点击
const handleMessageClick = (e) => {
  e.stopPropagation()
  if (!showMessagePopover.value) {
    // 立即打开弹窗
    showMessagePopover.value = true
    showAllMessages.value = false
    selectedMessageIndex.value = -1
    activeFeature.value = 'message'
    // 然后获取消息列表（不等待，loading 会在 fetchMessageList 中控制）
    fetchMessageList()
  } else {
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
  if (messageTriggerRef.value && !messageTriggerRef.value.contains(e.target)) {
    showMessagePopover.value = false
    if (activeFeature.value === 'message') {
      activeFeature.value = ''
    }
  }
  if (faqTriggerRef.value && !faqTriggerRef.value.contains(e.target)) {
    showFaqPopover.value = false
    if (activeFeature.value === 'faq') {
      activeFeature.value = ''
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
.header-features {
  display: flex;
  align-items: center;
  height: 64px;

  .header-feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    position: relative;

    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }

    .feature-icon-wrapper {
      position: relative;
      width: 29px;
      height: 29px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;

      .feature-icon-img {
        width: 29px;
        height: 29px;
        display: block;
      }

      .feature-badge {
        position: absolute;
        top: -4px;
        right: -4px;
      }
    }

    .feature-text {
      font-size: 12px;
      line-height: 1.2;
      white-space: nowrap;
      color: #455980;
      transition: color 0.2s;

      &.active {
        color: #3A82F9;
      }

      &.feature-text-red {
        color: #EB445A;
      }
    }
  }

  .feature-divider {
    width: 1px;
    height: 40px;
    background: #e8e8e8;
    margin: 0 4px;
  }

  .faq-trigger-wrapper {
    position: relative;
  }
}

// 消息触发区域
.message-trigger-wrapper {
  position: relative;
}

// 消息弹窗样式
.message-popover-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 290px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
}

.message-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 0;
}

.message-item {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 16px;
  border-bottom: 1px solid #DEE9FF;
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background-color: #DEE9FF;
    
    .message-content {
      .message-text {
        color: #3A82F9;
      }
    }
  }

  &:hover {
    background-color: #DEE9FF;
    
    .message-content {
      .message-text {
        color: #3A82F9;
      }
    }
  }

  .message-icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 7px;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .message-content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    display: flex;
    align-items: center;

    .message-text {
      font-size: 15px;
      font-weight: 500;
      color: #455980;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.message-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;

  .message-count {
    font-size: 13px;
    color: #86909c;
    margin-bottom: 12px;
  }

  .view-all-btn {
    width: 192px;
    height: 40px;
    background-color: #3A82F9;
    border: none;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
    outline: none;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:focus {
      outline: none;
    }
  }
}

.message-empty {
  padding: 40px 20px;
  text-align: center;
  color: #86909c;
  font-size: 14px;
}

.message-loading {
  padding: 40px 20px;
  text-align: center;
  color: #86909c;
  font-size: 14px;
}

// 常见问题弹窗样式
.faq-popover-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-center-btn {
  width: 154px;
  height: 40px;
  background-color: #3A82F9;
  border: none;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: none;
  }
}
</style>


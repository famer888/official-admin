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
            class="absolute -top-[6px] -right-[6px] message-badge"
            :class="{ 'message-badge-double': state.messageCount >= 10 }"
          />
        </div>
        <span class="text-xs leading-tight whitespace-nowrap text-[#455980] transition-colors" :class="{ 'text-[#3A82F9]': activeFeature === 'message' }">站内消息</span>
      </div>
      
      <!-- 消息弹窗 -->
      <PopoverList
        :show="showMessagePopover"
        :list="displayedMessages"
        :loading="loadingMessages"
        loading-text="加载中..."
        empty-text="暂无消息"
        :hovered-index="hoveredMessageIndex"
        :selected-index="selectedMessageIndex"
        @item-click="(item, index) => handleMessageItemClick(index)"
        @mouse-enter="(item, index) => hoveredMessageIndex = index"
        @mouse-leave="() => hoveredMessageIndex = -1"
        ref="messagePopoverRef"
      >
        <template #item="{ item, index }">
          <div class="w-7 h-7 flex-shrink-0 flex items-center justify-center mr-[7px]">
            <img src="@/assets/images/money.svg" alt="icon" class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0 overflow-hidden flex items-center">
            <div class="text-[15px] font-medium leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis" :class="selectedMessageIndex === index || hoveredMessageIndex === index ? 'text-[#3A82F9]' : 'text-[#455980]'">{{ item.message }}</div>
          </div>
        </template>
        <template #footer>
          <div class="text-[13px] text-[#86909c] mb-3">共有{{ state.total }}条未读消息</div>
          <button
            v-if="state.total > 0"
            @click="toggleShowAll"
            class="w-[192px] h-10 bg-[#3A82F9] border-none text-white text-sm rounded cursor-pointer transition-opacity outline-none hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
            :disabled="loadingMessages"
          >
            {{ loadingMessages ? '加载中...' : '查看全部消息' }}
          </button>
        </template>
      </PopoverList>
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
    
    <!-- 常见问题弹窗 -->
    <!-- 简单模式：只显示按钮 -->
    <div 
      v-if="showFaqPopover && !faqShowDetailMode" 
      ref="faqPopoverRef"
      class="absolute top-full left-1/2 -translate-x-1/2 z-[1000] mt-2 flex items-center justify-center"
      @click.stop
    >
      <button class="w-[180px] h-[47px] bg-[#3A82F9] border-none text-white text-base rounded cursor-pointer outline-none flex items-center justify-center gap-1.5 focus:outline-none shadow-lg" @click="goToHelpCenter">
        前往帮助中心
        <img :src="helpCenterIcon" alt="icon" class="w-7 h-7 flex-shrink-0" />
      </button>
    </div>
    
    <!-- 详细模式：弹窗样式，包含按钮和联系方式列表 -->
    <PopoverList
      :show="showFaqPopover && faqShowDetailMode"
      :list="contactList"
      :loading="false"
      empty-text="暂无联系方式"
      :hovered-index="hoveredContactIndex"
      @item-click="handleContactClick"
      @mouse-enter="(item, index) => item.type !== 'hint' && (hoveredContactIndex = index)"
      @mouse-leave="() => hoveredContactIndex = -1"
      ref="faqPopoverRef"
    >
      <template #header>
        <button class="w-[192px] h-10 bg-[#3A82F9] border-none text-white text-sm rounded cursor-pointer outline-none flex items-center justify-center gap-1.5 focus:outline-none hover:opacity-90" @click="goToHelpCenter">
          前往帮助中心
          <img :src="helpCenterIcon" alt="icon" class="w-5 h-5 flex-shrink-0" />
        </button>
      </template>
      <template #item="{ item, index }">
        <!-- 图标区域：hint 类型不显示图标 -->
        <div v-if="item.type !== 'hint'" class="flex-shrink-0 flex items-center justify-center mr-[17px]" :class="item.type === 'avatar' ? 'w-8 h-8' : 'w-7 h-7'">
          <img v-if="item.type === 'avatar'" :src="item.icon" alt="icon" class="w-7 h-7 rounded-full" />
          <img v-else-if="item.icon" :src="item.icon" alt="icon" class="w-6 h-6" />
        </div>
        <!-- 文字区域 -->
        <div :class="item.type === 'hint' ? 'w-full text-center' : 'flex-1 min-w-0 overflow-hidden flex items-center'">
          <div 
            class="text-[15px] leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis"
            :class="{
              'text-[#86909c]': item.type === 'hint',
              'text-[#455980] font-semibold': item.type !== 'hint'
            }"
          >
            {{ item.label }}
          </div>
        </div>
      </template>
    </PopoverList>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { NBadge, useMessage } from 'naive-ui'
import layout1Icon from '@/assets/images/layout/layout1.svg'
import layout2Icon from '@/assets/images/layout/layout2.svg'
import layout3Icon from '@/assets/images/layout/layout3.svg'
import layout4Icon from '@/assets/images/layout/layout4.svg'
import layout5Icon from '@/assets/images/layout/layout5.svg'
import helpCenterIcon from '@/assets/images/msg-type4.svg'
import telegramIcon from '@/assets/images/telegram.svg'
import wechatIcon from '@/assets/images/wechat.svg'
import emailIcon from '@/assets/images/email.svg'
import avatarIcon from '@/assets/images/avatar.svg'
import { getUnreadMessageCount, getUnreadMessageList, markMessageRead, getAdManager } from '@/api/header'
import { useUser } from '@/store/modules/user'
import { SSEManager } from '@/utils/sse'
import { useGlobSetting } from '@/hooks/setting'
import PopoverList from './PopoverList.vue'

const emit = defineEmits(['logout'])

const router = useRouter()
const message = useMessage()
const { apiUrl, urlPrefix } = useGlobSetting()
const sseManager = new SSEManager(apiUrl, urlPrefix)
const userStore = useUser()

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
const hoveredContactIndex = ref(-1) // 当前 hover 的联系方式项索引

// 根据 name 是否为 null 判断显示模式
const faqShowDetailMode = computed(() => {
  return state.adManager.name !== null
})

const state = reactive({
  messageCount: 0,
  usdBalance: '0.00',
  userId: '',
  messages: [],
  total: 0, // 消息总数
  adManager: {
    name: null,
    telegram: null,
    wechat: null,
    email: null
  }
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
    // 从数据仓库获取 userId 和 balance
    const userId = userStore.info?.userId
    const balance = userStore.info?.balance
    
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
      state.messages = res.data.latestUnreadMessages || []
      state.total = res.data.unreadCount || 0
      
      // 如果有新消息，调用标记已读接口
      if (state.messages.length > 0 && state.userId) {
        try {
          const messageIds = state.messages.map(msg => msg.messageId).filter(id => id != null)
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

// 获取广告经理信息
const fetchAdManager = async () => {
  try {
    const res = await getAdManager()
    if (res?.data) {
      state.adManager = {
        name: res.data.name || null,
        telegram: res.data.telegram || null,
        wechat: res.data.wechat || null,
        email: res.data.email || null
      }
    }
  } catch (error) {

  }
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

// 联系方式配置
const contactConfig = [
  {
    type: 'hint',
    label: '亦可联系您专属的广告经理',
    value: 'hint',
    show: true // 提示项总是显示
  },
  {
    type: 'avatar',
    icon: avatarIcon,
    label: '商务大神1',
    value: 'manager',
    field: 'name' // 对应的字段名
  },
  {
    type: 'telegram',
    icon: telegramIcon,
    field: 'telegram',
    value: 'telegram'
  },
  {
    type: 'wechat',
    icon: wechatIcon,
    field: 'wechat',
    value: 'wechat'
  },
  {
    type: 'email',
    icon: emailIcon,
    field: 'email',
    value: 'email'
  }
]

// 动态生成联系方式列表
const contactList = computed(() => {
  return contactConfig
    .filter(config => {
      // 如果配置了 show: true，总是显示
      if (config.show) return true
      // 如果有 field 配置，检查对应字段是否有值
      if (config.field) {
        return state.adManager[config.field] !== null
      }
      return false
    })
    .map(config => ({
      type: config.type,
      icon: config.icon,
      label: config.label || state.adManager[config.field],
      value: config.value
    }))
})

// 处理联系方式点击
const handleContactClick = (contact) => {
  // 根据联系方式类型执行不同操作
  if (contact.type === 'hint') {
    // 提示项，可以不做任何操作或显示提示
    return
  } else if (contact.type !== 'avatar') {
    // 复制联系方式到剪贴板
    navigator.clipboard.writeText(contact.label).then(() => {
      message?.success('复制成功')
    }).catch(() => {
      message?.error('复制失败，请重试')
    })
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

// 通用的点击外部关闭弹窗处理函数
const setupClickOutside = (showRef, triggerRef, popoverRef, featureName) => {
  const popoverElement = computed(() => {
    if (!showRef.value) return null
    return popoverRef.value?.popoverRef || popoverRef.value
  })

  onClickOutside(
    computed(() => [triggerRef.value, popoverElement.value].filter(Boolean)),
    () => {
      if (showRef.value) {
        showRef.value = false
        if (activeFeature.value === featureName) {
          activeFeature.value = ''
        }
      }
    }
  )
}

// 设置消息弹窗和常见问题弹窗的点击外部关闭
setupClickOutside(showMessagePopover, messageTriggerRef, messagePopoverRef, 'message')
setupClickOutside(showFaqPopover, faqTriggerRef, faqPopoverRef, 'faq')

// 组件挂载时获取未读消息数量并建立 SSE 连接
onMounted(() => {
  fetchUnreadMessageCount()
  initSSEConnection()
  fetchAdManager() // 获取广告经理信息
})

onUnmounted(() => {
  // 组件卸载时关闭 SSE 连接
  closeSSEConnection()
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



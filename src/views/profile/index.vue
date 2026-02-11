<template>
  <div class="p-5">
    <div class="text-xl font-semibold text-gray-800 mb-4">个人中心</div>
    <n-tabs v-model:value="activeTab" type="bar" animated>
      <!-- 个人信息 -->
      <n-tab-pane name="info" tab="个人信息">
        <UserInfo ref="userInfoRef" />
      </n-tab-pane>

      <!-- 密码修改 -->
      <n-tab-pane name="password" tab="密码修改">
        <PasswordChange />
      </n-tab-pane>

      <!-- 消息 -->
      <n-tab-pane name="messages">
        <template #tab>
          <span>消息</span>
          <n-badge
            v-if="unreadCount > 0"
            :value="unreadCount"
            :max="99"
            type="error"
            class="ml-2"
          />
        </template>
        <Messages ref="messagesRef" @update:unread-count="handleUnreadCountUpdate" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'
  import UserInfo from './components/UserInfo.vue'
  import PasswordChange from './components/PasswordChange.vue'
  import Messages from './components/Messages.vue'
  import { defineOptions } from 'vue'

  defineOptions({
    name: 'PersonCenter',
  })

  const activeTab = ref('info')
  const userInfoRef = ref(null)
  const messagesRef = ref(null)
  const unreadCount = ref(0)

  // 处理未读消息数量更新
  const handleUnreadCountUpdate = (count) => {
    unreadCount.value = count || 0
  }

  // 监听标签页切换，切换到消息页时加载消息
  watch(activeTab, (val) => {
    if (val === 'messages' && messagesRef.value) {
      messagesRef.value.loadMessages()
    }
  })

  onMounted(() => {
    // Messages 组件会自动加载并触发 update:unread-count 事件
    // 所以这里不需要手动调用
  })
</script>

<style lang="less" scoped>
  .n-form {
    .n-grid {
      & > div:last-of-type {
        .n-space {
          justify-content: center !important;
          margin-left: 0 !important;
        }
      }
    }
  }
</style>

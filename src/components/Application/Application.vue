<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <MessageContent />
          <slot name="default"></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { NDialogProvider, NNotificationProvider, NMessageProvider } from 'naive-ui'
  import { MessageContent } from '@/components/MessageContent'

  const theme = {
    common: {
      errorColor: '#f53f3f',
      successColor: '#00b42a',
      warningColor: '#ff7d00',
    },
  }

  export default defineComponent({
    name: 'Application',
    components: {
      NDialogProvider,
      NNotificationProvider,
      NMessageProvider,
    },
    setup() {
      return {
        theme,
      }
    },
  })
</script>

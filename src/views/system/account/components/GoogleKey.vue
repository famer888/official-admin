<template>
  <n-spin :show="loading">
    <div class="google-key">
      <div class="mb-4"
        >使用 google身份验证器App（Authenticator）,扫描下方二维码 或者手动输入密钥</div
      >
      <n-qr-code :value="info?.qrbarcodeURL" />
      <div class="mt-4">密钥：</div>
      <div class="flex items-center gap-8">
        <span>{{ info?.secret }}</span>
        <n-button type="primary" v-copy="info?.secret">复制密钥</n-button>
      </div>
    </div>
  </n-spin>
</template>

<script setup>
  const props = defineProps({
    info: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })
</script>

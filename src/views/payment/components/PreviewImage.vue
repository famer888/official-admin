<template v-if="payVoucher">
  <div class="flex items-center justify-center">
    <n-image :src="url" width="300" preview-disabled />
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  import { useUser } from '@/store/modules/user'

  const use = useUser()

  const props = defineProps({
    imageUrl: {
      type: String,
      default: '',
    },
  })

  const url = computed(() => use.base + props.imageUrl)
</script>
<style lang="less">
  .preview-image-container {
    background-color: transparent !important;
    box-shadow: unset !important;
  }
</style>

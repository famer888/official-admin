<template>
  <div class="logo">
    <div class="p-[3px] bg-[#165dFF] rounded-[5px] mr-2">
      <component :is="websiteConfig.logo" class="w-[25px] h-[25px]" />
    </div>
    <h2 v-show="!collapsed" class="title">{{ websiteConfig.title }}</h2>
  </div>
</template>

<script lang="ts">
  import { websiteConfig } from '@/config/website.config'
  export default {
    name: 'Index',
    props: {
      collapsed: {
        type: Boolean,
      },
    },
    data() {
      return {
        websiteConfig,
      }
    },
  }
</script>

<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin: 0;
    }
  }
</style>

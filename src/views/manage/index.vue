<template>
  <div class="w-full p-3 bg-[#ffffff] font-PingFang SC">
    <!-- 顶部横幅 -->
    <div
      class="relative w-full h-[120px] rounded-md overflow-hidden cursor-pointer mb-3 shadow-sm transition-all duration-300"
      @click="goToSupermarket"
    >
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${topBannerBg})` }"
      ></div>
      <div
        class="relative z-10 h-full flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6"
      >
        <div class="text-white text-center sm:text-left">
          <div class="text-[28px]">立即查看可用广告位</div>
          <div class="text-[28px] pl-10">开启收入倍增之路!</div>
        </div>
        <n-button
          :bordered="false"
          class="!text-[16px] border-none !rounded-[4px] !bg-white !text-[#3A82F9] transition-all duration-300 px-8 py-4"
        >
          查看广告超市
        </n-button>
      </div>
    </div>

    <!-- 底部内容区域 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- 左侧帮助中心 -->
      <div
        class="bg-[#F4F5F9] rounded-md p-4 flex flex-col md:flex-row items-center md:items-center gap-4 cursor-pointer shadow-sm transition-all duration-300 text-center md:text-left h-auto md:h-[238px]"
        @click="goToHelpCenter"
      >
        <div class="flex-shrink-0 w-auto h-24 md:h-full relative">
          <img
            :src="helpCenterIcon"
            alt="帮助中心"
            class="w-auto h-full object-contain mx-auto md:mx-0"
          />
        </div>
        <div class="flex-1 flex flex-col justify-end gap-4 md:gap-6 mt-2 md:mt-0">
          <div class="text-[16px] text-[#455980] leading-relaxed">
            有什么不清楚,可以查看常见问题。亦可联系您专属广告经理
          </div>
          <n-button
            :bordered="false"
            class="!h-7 !px-8 md:mb-6 !py-4 !border-none !text-[16px] !rounded-[4px] !bg-white !text-[#3A82F9] self-center md:self-start transition-all duration-300"
          >
            前往帮助中心
          </n-button>
        </div>
      </div>

      <!-- 右侧图片展示（暂不放视频） -->
      <div
        class="bg-[#F4F5F9] rounded-md p-3 shadow-sm overflow-hidden flex items-center justify-center h-auto md:h-[238px]"
      >
        <img :src="magBtmRight" alt="广告展示" class="w-full h-full object-contain" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import VideoPlayer from './components/VideoPlayer.vue'
  import topBannerBg from '@/assets/images/mag-top.jpg'
  import helpCenterIcon from '@/assets/images/mag-left.jpg'
  import magBtmRight from '@/assets/images/mag-right.jpg'
  import { useCollectUserInfoModal } from '@/views/manage/collectUserInfo/index'
  import { useUserStore } from '@/store/modules/user'
  defineOptions({
    name: 'Manage',
  })
  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo)
  const { openCollectUserInfoModal } = useCollectUserInfoModal()

  const router = useRouter()
  const { VITE_WEBSITE_URL } = import.meta.env

  // 视频配置（可以从接口获取或通过props传入）
  const videoUrl = ref('') // 视频URL，如果不传则只显示封面
  const videoCover = ref('') // 视频封面图

  // 跳转到广告超市
  const goToSupermarket = () => {
    router.push('/supermarket/list')
  }

  // 跳转到官网帮助中心页
  const goToHelpCenter = () => {
    window.open(VITE_WEBSITE_URL + '/contact/help-center', '_blank')
  }
  watch (userInfo.value, (newVal) => {
    if (newVal&&newVal.isCompelte === 1) {
      openCollectUserInfoModal({ visible: true })
    }
  }, { immediate: true })
</script>

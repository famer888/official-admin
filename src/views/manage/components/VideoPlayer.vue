<template>
  <div
    class="w-full h-full relative cursor-pointer rounded-lg overflow-hidden bg-[#f5f5f5]"
    @click="handlePlay"
  >
    <!-- 封面区域 -->
    <div
      v-if="!isPlaying"
      class="w-full h-full relative flex items-center justify-center bg-[#f0f0f0]"
    >
      <img
        v-if="cover"
        :src="cover"
        alt="视频封面"
        class="w-full h-full object-cover"
      />
      <!-- 播放按钮：仅当有封面或视频地址时显示 -->
      <div
        v-if="videoUrl || cover"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
      >
        <n-icon color="#667eea" class="text-[42px] ml-[2px]">
          <PlayCircle size="42" />
        </n-icon>
      </div>
    </div>

    <!-- 内嵌播放区域（预留） -->
    <div v-else class="w-full h-full">
      <video
        ref="videoRef"
        :src="videoUrl"
        controls
        autoplay
        class="w-full h-full object-cover"
        @ended="handleEnded"
      ></video>
    </div>

    <!-- 视频播放弹窗 -->
    <n-modal
      v-model:show="showModal"
      preset="card"
      :style="{ width: '800px', maxWidth: '90vw' }"
      title="视频播放"
      :bordered="false"
      :segmented="false"
      @close="handleClose"
    >
      <div class="w-full py-5">
        <video
          v-if="videoUrl"
          ref="modalVideoRef"
          :src="videoUrl"
          controls
          autoplay
          class="w-full max-h-[70vh] rounded-lg"
        ></video>
        <div
          v-else
          class="flex items-center justify-center min-h-[300px]"
        >
          <n-empty description="暂无视频" />
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PlayCircle } from '@vicons/ionicons5'

interface Props {
  videoUrl?: string
  cover?: string
}

const props = withDefaults(defineProps<Props>(), {
  videoUrl: '',
  cover: '',
})

const isPlaying = ref(false)
const showModal = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)
const modalVideoRef = ref<HTMLVideoElement | null>(null)

// 点击播放图标
const handlePlay = () => {
  if (props.videoUrl) {
    showModal.value = true
  }
}

// 视频播放结束
const handleEnded = () => {
  isPlaying.value = false
}

// 关闭弹窗
const handleClose = () => {
  showModal.value = false
  if (modalVideoRef.value) {
    modalVideoRef.value.pause()
    modalVideoRef.value.currentTime = 0
  }
}

// 监听弹窗关闭，重置视频
watch(showModal, (val) => {
  if (!val && modalVideoRef.value) {
    modalVideoRef.value.pause()
    modalVideoRef.value.currentTime = 0
  }
})
</script>

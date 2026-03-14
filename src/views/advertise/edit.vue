<template>
  <div class="min-h-full p-2.5">
    <div class="flex items-center gap-3 text-sm mb-5">
      <span
        class="text-[#1D2129] text-base cursor-pointer hover:text-[#3A82F9] font-medium"
        @click="router.push('/advertise/plan')"
      >
        广告管理
      </span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.3535 0.353516L0.353516 11.3535" stroke="#3A82F9" />
      </svg>
      <span class="text-[#3A82F9] text-base">编辑广告计划</span>
    </div>

    <div class="p-5 bg-white rounded-[8px]">
      <n-form
        ref="formRef"
        class="advertise-edit-form"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-align="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="广告计划名称" path="planName">
          <n-input
            v-model:value="formData.planName"
            placeholder="最多20个字条，支持中英文及部分特殊符号"
            maxlength="20"
            size="large"
            class="!w-[492px] ad-input"
          />
        </n-form-item>

        <n-form-item label="" path="position">
          <label class="n-form-item-label n-form-item-label--right-hanging-mark">
            <span class="n-form-item-label__text">投放位置</span>
          </label>
          <n-button type="primary" ghost class="btn-select-position" @click="handleSelectPosition">
            选择投放位置
          </n-button>
        </n-form-item>
      </n-form>

      <n-modal
        v-model:show="positionModalVisible"
        preset="card"
        title="选择投放位置"
        class="w-[1569px] position-picker-modal"
        :bordered="false"
        closable
        header-class="position-picker-modal-header"
        :header-style="positionModalHeaderStyle"
        @close="handlePositionModalClose"
      >
        <div class="pt-5">
          <PositionPickerModal :initial-selected="initialSelectedPlacements" @save="handlePositionSave"
            @cancel="handlePositionCancel" />
        </div>
      </n-modal>

      <div class="mb-10">
        <div class="edit-section-label mb-4">投放位置</div>
        <div class="flex flex-wrap gap-5">
          <div
            v-for="(pos, index) in formData.positions"
            :key="index"
            class="flex-1 min-w-[300px] rounded-[4px] bg-[#F4F5F9] p-4"
          >
            <div class="edit-position-title mb-2">位置{{ index + 1 }}</div>
            <div class="edit-position-info">
              <div><span>广告位：</span>{{ pos.adSlot }}</div>
              <div><span>投放日期：</span>{{ pos.dateRange }}</div>
              <div><span>投放预算：</span>{{ pos.budget }}</div>
            </div>
          </div>
          <div v-if="!formData.positions?.length" class="text-sm text-[#86909C]">
            暂无投放位置，请点击上方「选择投放位置」添加
          </div>
        </div>
      </div>

      <div class="mb-[120px]">
        <div class="edit-section-label mb-4">广告创意</div>
        <div class="flex flex-wrap gap-6">
          <div
            v-for="(creative, index) in formData.creatives"
            :key="index"
            class="flex-1 min-w-[300px] rounded-[4px] bg-[#F4F5F9] p-4 flex flex-col gap-4"
          >
            <div class="edit-creative-title mb-2">素材{{ index + 1 }}：{{ creative.title }}</div>
            <div class="flex gap-4">
              <div
                class="w-[120px] h-[120px] rounded-[8px] overflow-hidden bg-white flex-shrink-0 flex items-center justify-center"
              >
                <img
                  v-if="creative.imageUrl"
                  :src="creative.imageUrl"
                  alt="素材预览"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-xs text-[#999]">暂无图片</span>
              </div>
              <ul class="edit-creative-tips list-disc pl-4">
                <li>支持上传jpg、png、webp 格式的文件</li>
                <li>限制上传文件大小5M</li>
                <li>限制图片的尺寸比例为 【{{ creative.ratio }}】</li>
              </ul>
            </div>
            <div class="flex items-center justify-start gap-3 w-full">
              <span class="edit-link-label">跳转连接</span>
              <input v-model="creative.link" type="text" class="edit-link-input" />
            </div>
          </div>
          <div v-if="!formData.creatives?.length" class="text-sm text-[#86909C]">暂无广告创意</div>
        </div>
      </div>

      <div class="flex items-center gap-5">
        <n-button
          type="secondary"
          class="btn-cancel !w-[200px] !h-[48px] !rounded-[4px] font-medium"
          @click="handleCancel"
          >取消</n-button
        >
        <n-button
          type="primary"
          class="!w-[200px] !h-[48px] !rounded-[4px] text-base"
          @click="handleSave"
          >保存</n-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import PositionPickerModal from './components/advertise-position/components/PositionPickerModal.vue'

  defineOptions({
    name: 'AdvertiseEdit',
  })

  const router = useRouter()
  const route = useRoute()

  const formRef = ref(null)
  const positionModalVisible = ref(false)
  // 与选择弹窗一致的数据结构，用于回显到弹窗
  const initialSelectedPlacements = ref([])
  // Card 预设下头部样式（header-style）
  const positionModalHeaderStyle = {
    background: '#e8edf8',
    paddingTop: '20px',
    paddingBottom: '20px',
  }

  // 暂无接口数据，使用 mock 便于预览投放位置、广告创意
  const formData = reactive({
    planName: '1月-万象APP活跃用户福利',
    position: '',
    positions: [
      {
        adSlot: '万象-商户-Y02-T02-长/短视/动漫贴片广告',
        dateRange: '2026.01.26-2026.01.28.2026.02.04',
        budget: 20000,
      },
      {
        adSlot: '万象-商户-Y02-T02-长/短视/动漫贴片广告',
        dateRange: '2026.01.26-2026.01.28.2026.02.04',
        budget: 20000,
      },
    ],
    creatives: [
      {
        title: '万象-商户-Y02-T02-长/短视频/动漫贴片广告 APP-尺寸 [152*$59]',
        imageUrl: '',
        ratio: '359:152',
        link: '',
      },
      {
        title: '万象-商户-Y02-T02-长/短视频/动漫贴片广告 APP-尺寸 [152*$59]',
        imageUrl: '',
        ratio: '4:3',
        link: 'https://xxxxxxxxx.com',
      },
    ],
  })

  const rules = {
    planName: { required: true, message: '请输入广告计划名称', trigger: 'blur' },
  }

  if (route.query.id) {
    if (route.query.planName) formData.planName = route.query.planName
    if (route.query.position) formData.position = route.query.position
    if (route.query.positions) {
      formData.positions =
        typeof route.query.positions === 'string'
          ? JSON.parse(route.query.positions)
          : route.query.positions
    }
    if (route.query.creatives) {
      formData.creatives =
        typeof route.query.creatives === 'string'
          ? JSON.parse(route.query.creatives)
          : route.query.creatives
    }
  }

  const handleSelectPosition = () => {
    // 将当前 formData.positions 转为弹窗所需的 SelectedPlacementItem 格式（若有历史数据可在此做映射）
    initialSelectedPlacements.value = []
    positionModalVisible.value = true
  }

  const handlePositionSave = (list) => {
    formData.positions = list.map((item) => ({
      adSlot: item.positionName || item.slotName,
      dateRange: item.deliveryTime,
      budget: item.budget,
    }))
    positionModalVisible.value = false
  }

  const handlePositionCancel = () => {
    positionModalVisible.value = false
  }

  const handlePositionModalClose = () => {
    positionModalVisible.value = false
  }

  const handleCancel = () => {
    router.push('/advertise/plan')
  }

  const handleSave = async () => {
    try {
      await formRef.value?.validate()
      window.$message?.success('保存成功')
      router.push('/advertise/plan')
    } catch {
      // validation failed
    }
  }
</script>

<style scoped>
  .advertise-edit-form :deep(.n-form-item-label__text) {
    color: #1d2129;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
  }

  .ad-input :deep(.n-input__input-el),
  .ad-input :deep(.n-input-wrapper) {
    background-color: #f4f5f9;
    border: none;
    box-shadow: none;
  }

  .ad-input:focus-within :deep(.n-input-wrapper) {
    border: none;
    box-shadow: none;
  }

  .btn-cancel {
    border: 1px solid #f4f5f9 !important;
    box-shadow: none;
    background: #f4f5f9 !important;
    color: #3a82f9 !important;
    font-weight: 500 !important;
    font-size: 16px !important;
    line-height: 16px !important;
    text-align: center !important;
    outline: none !important;
  }

  .btn-select-position {
    width: 144px;
    height: 42px;
    border-radius: 4px;
    padding: 8px 12px;
    border: 1px solid #3a82f9;
    background: #f4f5f9 !important;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    color: #3a82f9;
  }

  .edit-section-label {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0;
    color: #455980;
  }

  .edit-position-title {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0;
    color: #455980;
  }

  .edit-position-info > div {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0;
    color: #86909c;
  }

  .edit-position-info > div span {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0;
    color: #455980;
  }

  .edit-creative-title {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0;
    color: #000000;
  }

  .edit-creative-tips {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 26px;
    letter-spacing: 0;
    color: #455980;
  }

  .edit-link-label {
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0;
    text-align: center;
    color: #1d2129;
  }

  .edit-link-input {
    flex: 1;
    height: 36px;
    padding: 0 12px;
    background: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    color: #1d2129;
    outline: none;
  }

  .edit-link-input::placeholder {
    color: #86909c;
  }
</style>

<!-- 模态框头部类名由 header-class 指定，可能被 teleport 到 body，用非 scoped 样式 -->
<style>
  /* 整个模态框（Card 预设）圆角 16px */
  .position-picker-modal.n-card {
    border-radius: 16px !important;
    overflow: hidden;
  }

  /* 标题在 n-card-header__main 内，需单独覆盖颜色与字体 */
  .position-picker-modal-header .n-card-header__main {
    color: #1d2129 !important;
    font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    line-height: 16px !important;
    letter-spacing: 0;
    text-align: center;
  }
</style>

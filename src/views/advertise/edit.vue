<template>
  <div class="min-h-full p-2.5">
    <AdBreadcrumb current-title="编辑广告计划" @back="router.push('/advertise/plan')" />

    <div class="p-5 bg-white rounded-lg">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-align="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item path="planName">
          <template #label>
            <span class="text-base font-medium text-[#1D2129]">广告计划名称</span>
          </template>
          <n-input
            v-model:value="formData.planName"
            placeholder="最多20个字条，支持中英文及部分特殊符号"
            maxlength="20"
            size="large"
            :theme-overrides="inputTheme"
            class="!w-[492px]"
          />
        </n-form-item>

        <n-form-item path="position">
          <template #label>
            <span class="text-base font-medium text-[#1D2129]">投放位置</span>
          </template>
          <n-button
            ghost
            color="#3A82F9"
            class="!w-[144px] !h-[42px] !rounded !bg-[#F4F5F9] !font-semibold !text-base"
            @click="handleSelectPosition"
          >
            选择投放位置
          </n-button>
        </n-form-item>
      </n-form>

      <div class="mb-10">
        <div class="text-base leading-4 font-medium text-[#455980] mb-4">投放位置</div>
        <div class="flex flex-wrap gap-5">
          <AdPositionCard
            v-for="(pos, index) in formData.positions"
            :key="index"
            :position="pos"
            :index="index"
          />
          <div v-if="!formData.positions?.length" class="text-sm text-[#86909C]">
            暂无投放位置，请点击上方「选择投放位置」添加
          </div>
        </div>
      </div>

      <div class="mb-[120px]">
        <div class="text-base leading-4 font-medium text-[#455980] mb-4">广告创意</div>
        <div class="flex flex-wrap gap-6">
          <AdCreativeCard
            v-for="(creative, index) in formData.creatives"
            :key="index"
            :creative="creative"
            :index="index"
            editable
            @update:link="(val) => (creative.link = val)"
          />
          <div v-if="!formData.creatives?.length" class="text-sm text-[#86909C]">
            暂无广告创意
          </div>
        </div>
      </div>

      <div class="flex items-center gap-5">
        <n-button
          color="#F4F5F9"
          text-color="#3A82F9"
          class="!w-[200px] !h-[48px] !rounded !font-medium !text-base"
          @click="handleCancel"
        >
          取消
        </n-button>
        <n-button
          type="primary"
          class="!w-[200px] !h-[48px] !rounded !text-base"
          @click="handleSave"
        >
          保存
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import AdBreadcrumb from './components/AdBreadcrumb.vue'
  import AdPositionCard from './components/AdPositionCard.vue'
  import AdCreativeCard from './components/AdCreativeCard.vue'
  import { useAdvertisePositionModal } from './components/advertise-position'

  defineOptions({ name: 'AdvertiseEdit' })

  const inputTheme = {
    color: '#F4F5F9',
    colorFocus: '#F4F5F9',
    border: '0 solid transparent',
    borderHover: '0 solid transparent',
    borderFocus: '0 solid transparent',
    boxShadowFocus: 'none',
  }

  const router = useRouter()
  const route = useRoute()
  const formRef = ref(null)
  const { openAdvertisePositionModal } = useAdvertisePositionModal()

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
    openAdvertisePositionModal({
      initialSelected: [],
      onSave: (list) => {
        formData.positions = list.map((item) => ({
          adSlot: item.positionName || item.slotName,
          dateRange: item.deliveryTime,
          budget: item.budget,
        }))
      },
    })
  }

  const handleCancel = () => router.push('/advertise/plan')

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

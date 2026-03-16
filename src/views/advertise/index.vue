<template>
  <div>
    <pro-table
      ref="apiRef"
      :columns="columns"
      :request="getAdPlanPage"
      :tableProps="{ bordered: false, singleLine: true }"
    >
      <!-- 创建广告计划入口 -->
      <template #tableTitle>
        <n-button type="primary" class="h-[42px] rounded w-[160px]" @click="handleCreate">
          创建广告计划
        </n-button>
      </template>
    </pro-table>
  </div>
</template>

<script setup>
  /**
   * 广告管理 - 列表页
   * 使用 pro-table 组件，搜索表单由列定义自动生成
   */
  import { useRouter } from 'vue-router'
  import { getColumns } from './useData'
  import { getAdPlanPage } from './useApi'

  defineOptions({ name: 'AdvertisePlan' })

  const router = useRouter()
  const apiRef = ref(null)

  /** 刷新列表 */
  const reload = () => apiRef.value?.table?.reload?.()

  /** 表格列定义（含搜索字段），传入 reload 供操作按钮刷新列表 */
  const columns = computed(() => getColumns(reload))

  /** 跳转到创建广告计划页 */
  const handleCreate = () => router.push('/advertise/edit')
</script>

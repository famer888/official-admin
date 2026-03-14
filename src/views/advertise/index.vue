<template>
  <div class="p-[10px]">
    <!-- 搜索栏：按广告名称模糊查询 -->
    <div class="flex items-center gap-3 mb-5">
      <span class="text-base leading-4 font-medium text-[#1D2129] whitespace-nowrap text-center">
        广告名称
      </span>
      <n-input
        v-model:value="searchName"
        placeholder="关键字模糊查询"
        clearable
        :theme-overrides="inputTheme"
        class="!w-[287px] !h-[42px] !rounded mr-1"
        @keyup.enter="handleSearch"
      />
      <n-button type="primary" class="!h-[42px] !rounded !w-[96px]" @click="handleSearch">
        查询
      </n-button>
    </div>

    <!-- 创建广告计划入口 -->
    <div class="mb-5">
      <n-button type="primary" class="!h-[42px] !rounded !w-[160px]" @click="handleCreate">
        创建广告计划
      </n-button>
    </div>

    <!-- 广告计划列表 -->
    <div class="p-5 pt-2 bg-white rounded-lg">
      <pro-data-table
        ref="tableRef"
        :columns="columns"
        :bordered="false"
        :request="requestFn"
        :noWrapperStyle="true"
        :single-line="true"
      />
    </div>
  </div>
</template>

<script setup>
  /**
   * 广告管理 - 列表页
   * 功能：搜索、创建、分页展示广告计划
   */
  import { useRouter } from 'vue-router'
  import { getColumns } from './useData'
  import { getAdPlanPage } from './useApi'

  defineOptions({ name: 'AdvertisePlan' })

  /** 搜索输入框主题覆盖：灰底无边框 */
  const inputTheme = {
    color: '#F4F5F9',
    colorFocus: '#F4F5F9',
    border: '0 solid transparent',
    borderHover: '0 solid transparent',
    borderFocus: '0 solid transparent',
    boxShadowFocus: 'none',
    placeholderColor: '#86909C',
  }

  const router = useRouter()
  const searchName = ref('')
  const tableRef = ref(null)

  /** 表格列定义，传入 reload 供操作按钮刷新列表 */
  const columns = computed(() => getColumns(reload))

  /** 请求函数：将搜索关键字注入分页参数 */
  const requestFn = (params) =>
    getAdPlanPage({ ...params, planName: searchName.value || undefined })

  /** 刷新列表 */
  const reload = () => tableRef.value?.reload()

  /** 搜索：重置到第一页 */
  const handleSearch = () => tableRef.value?.reload({ pageNo: 1 })

  /** 跳转到创建广告计划页 */
  const handleCreate = () => router.push('/advertise/edit')
</script>

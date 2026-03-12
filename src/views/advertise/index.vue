<template>
  <div class="p-4 bg-white rounded-[8px]">
    <div class="flex items-center gap-3 mb-4">
      <span class="text-sm text-[#333] whitespace-nowrap">广告名称</span>
      <n-input
        v-model:value="searchName"
        placeholder="关键字模糊查询"
        clearable
        class="!w-[240px]"
        @keyup.enter="handleSearch"
      />
      <n-button type="primary" @click="handleSearch">查询</n-button>
    </div>

    <div class="mb-4">
      <n-button type="success" @click="handleCreate">创建广告计划</n-button>
    </div>

    <pro-data-table
      ref="tableRef"
      :columns="columns"
      :request="requestFn"
      :bordered="true"
      :noWrapperStyle="true"
    />
  </div>
</template>

<script setup>
  import { getColumns } from './useData'
  import { getAdPlanPage } from './useApi'

  defineOptions({
    name: 'AdvertisePlan',
  })

  const searchName = ref('')
  const tableRef = ref(null)

  const columns = computed(() => getColumns(reload))

  const requestFn = (params) => {
    return getAdPlanPage({
      ...params,
      planName: searchName.value || undefined,
    })
  }

  const reload = () => {
    tableRef.value?.reload()
  }

  const handleSearch = () => {
    tableRef.value?.reload({ pageNo: 1 })
  }

  const handleCreate = () => {
    window.$message?.success('点击了创建广告计划')
  }
</script>

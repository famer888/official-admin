<template>
  <div class="p-[10px]">
    <div class="flex items-center gap-3 mb-5">
      <span class="text-base leading-4 font-medium text-[#1D2129] whitespace-nowrap text-center">
        广告名称
      </span>
      <n-input
        v-model:value="searchName"
        placeholder="关键字模糊查询"
        clearable
        class="!w-[287px] !h-[42px] !rounded-[4px] ad-input mr-1"
        @keyup.enter="handleSearch"
      />
      <n-button type="primary" class="!h-[42px] !rounded-[4px] !w-[96px]" @click="handleSearch"
        >查询</n-button
      >
    </div>

    <div class="mb-5">
      <n-button type="primary" class="!h-[42px] !rounded-[4px] !w-[160px]" @click="handleCreate"
        >创建广告计划</n-button
      >
    </div>

    <div class="p-5 pt-2 bg-white rounded-[8px]">
      <pro-data-table
        ref="tableRef"
        :columns="columns"
        :bordered="false"
        :request="requestFn"
        :noWrapperStyle="true"
        class="no-row-divider-table"
      />
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { getColumns } from './useData'
  import { getAdPlanPage } from './useApi'

  defineOptions({
    name: 'AdvertisePlan',
  })

  const router = useRouter()
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
    router.push('/advertise/edit')
  }
</script>

<style scoped>
  .ad-input :deep(.n-input-wrapper) {
    background-color: #f4f5f9;
    padding: 8px 12px;
    border: none;
    box-shadow: none;
  }

  .ad-input:focus-within :deep(.n-input-wrapper) {
    border: none;
    box-shadow: none;
  }

  .ad-input :deep(.n-input__input-el) {
    font-size: 14px;
    line-height: 14px;
    font-weight: 400;
  }

  .ad-input :deep(.n-input__input-el::placeholder) {
    color: #86909c;
    font-size: 14px;
    line-height: 14px;
    font-weight: 400;
    text-align: center;
  }

  .no-row-divider-table :deep(.n-data-table) {
    border: none;
  }

  .no-row-divider-table :deep(.n-data-table-th),
  .no-row-divider-table :deep(.n-data-table-td) {
    border-bottom: none;
  }
</style>

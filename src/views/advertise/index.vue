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

    <n-data-table
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :bordered="true"
      :pagination="false"
      :row-key="(row) => row._uid"
    />

    <div class="flex items-center justify-between mt-4">
      <span class="text-sm text-[#999]">共{{ pagination.itemCount }}条记录</span>
      <n-pagination
        v-model:page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :item-count="pagination.itemCount"
        :page-sizes="[10, 20, 50]"
        show-size-picker
        show-quick-jumper
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
  import { getColumns } from './useData'
  import { getAdPlanPage } from './useApi'

  defineOptions({
    name: 'AdvertisePlan',
  })

  const searchName = ref('')
  const tableData = ref([])
  const loading = ref(false)

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
  })

  const columns = computed(() => getColumns(fetchData))

  const fetchData = async () => {
    loading.value = true
    try {
      const res = await getAdPlanPage({
        pageNo: pagination.page,
        pageSize: pagination.pageSize,
        planName: searchName.value || undefined,
      })
      if (res.code === 0) {
        tableData.value = res.data.dataList
        pagination.itemCount = res.data.total
      }
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
    pagination.page = 1
    fetchData()
  }

  const handlePageChange = (page) => {
    pagination.page = page
    fetchData()
  }

  const handlePageSizeChange = (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchData()
  }

  const handleCreate = () => {
    window.$message?.success('点击了创建广告计划')
  }

  onMounted(() => {
    fetchData()
  })
</script>

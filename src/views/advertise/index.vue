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
        :theme-overrides="inputTheme"
        class="!w-[287px] !h-[42px] !rounded mr-1"
        @keyup.enter="handleSearch"
      />
      <n-button type="primary" class="!h-[42px] !rounded !w-[96px]" @click="handleSearch">
        查询
      </n-button>
    </div>

    <div class="mb-5">
      <n-button type="primary" class="!h-[42px] !rounded !w-[160px]" @click="handleCreate">
        创建广告计划
      </n-button>
    </div>

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
  import { useRouter } from 'vue-router'
  import { getColumns } from './useData'
  import { getAdPlanPage } from './useApi'

  defineOptions({ name: 'AdvertisePlan' })

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

  const columns = computed(() => getColumns(reload))

  const requestFn = (params) =>
    getAdPlanPage({ ...params, planName: searchName.value || undefined })

  const reload = () => tableRef.value?.reload()

  const handleSearch = () => tableRef.value?.reload({ pageNo: 1 })

  const handleCreate = () => router.push('/advertise/edit')
</script>

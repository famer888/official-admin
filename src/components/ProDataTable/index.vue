<template>
  <div class="mt-3">
    <Header :title="title" :noWrapperStyle="restProps.noWrapperStyle">
      <template #filterForm>
        <Form
          ref="formRef"
          :columns="columns"
          :formProps="formProps"
          @on-value-change="requestTableData"
          @submit="handleSubmit"
        />
      </template>
      <template #content>
        <n-data-table
          ref="tableRef"
          :class="{
            'pro-data-table': !title && true,
          }"
          :data="list"
          :columns="columns"
          :loading="loading"
          :pagination="false"
          v-bind="restProps"
        >
          <template #empty>
            <EmptyComponent />
          </template>
        </n-data-table>
        <Pagination
          v-if="(pagination.itemCount ?? 0) > 0"
          :paginationProps="pagination"
          :pagination="props.pagination"
        />
      </template>
    </Header>
  </div>
</template>
<script lang="ts" setup>
  import { useAttrs } from 'vue'
  import { DataTableProps, FormActions } from './types'
  import Header from './Header.vue'
  import Form from './Form/index.vue'
  import Pagination from './Pagination/index.vue'
  import { usePagination } from './hooks'
  import { removeEmpty } from '@/utils/removeEmpty'
  import EmptyComponent from './Empty.vue'

  const restProps = useAttrs() as unknown as any

  const form = useTemplateRef<FormActions>('formRef')
  const table = useTemplateRef<ComponentPublicInstance>('tableRef')

  const emit = defineEmits(['data-table'])

  const props = withDefaults(defineProps<DataTableProps>(), {
    data: () => [],
    columns: () => [],
    pagination: true,
  })

  // table数据
  const list = ref<Array<Recordable>>([])
  // 加载状态
  const loading = ref(false)

  const requestTableDataFn = props.request

  /**
   * 分页参数
   */
  const { pagination, updatePage, updatePageSize, setPaginationInfo } = usePagination({
    itemCount: 0,
    pageSize: 10,
    page: 1,
    prefix: ({ itemCount }) => {
      return h('div', {}, itemCount ? `共计 ${pagination.itemCount} 条数据` : '')
    },
    showSizePicker: false,
    onUpdatePage: (page: number) => {
      handleUpdatePage(page)
    },
    onUpdatePageSize: (pageSize: number) => {
      handleUpdatePageSize(pageSize)
    },
    ...props.paginationProps,
  })

  /**
   * 请求表格数据
   * @param params
   */
  const requestTableData = async (params?: Recordable) => {
    loading.value = true
    const formValues = form.value?.getFieldsValue() || {}

    try {
      if (params?.pageNo || params?.pageSize) {
        setPaginationInfo({
          page: params.pageNo || pagination.page,
          pageSize: params.pageSize || pagination.pageSize,
        })
      }

      const paginationParams = {
        pageNo: pagination.page,
        pageSize: pagination.pageSize,
      }

      const payload = {
        ...formValues,
        ...paginationParams,
        ...params,
      }

      const realPayload = removeEmpty(payload)

      const res = await requestTableDataFn?.({ ...realPayload })
      loading.value = false

      if (res.code === 0) {
        list.value = res.data.dataList
        emit('data-table', res.data.dataList)

        setPaginationInfo({
          itemCount: res.data.total,
          pageSize: res.data.size,
          page: payload.pageNo,
        })
      } else {
        list.value = []
        setPaginationInfo({
          itemCount: 0,
          pageSize: 10,
          page: 1,
        })
      }
    } catch (err) {
      loading.value = false
    }
    console.log('list.value', list.value)
  }

  //页码切换
  function handleUpdatePage(page) {
    updatePage(page)
    requestTableData({ pageNo: page })
  }

  //分页数量切换
  function handleUpdatePageSize(size) {
    updatePageSize(size)
    requestTableData({ pageSize: size })
  }

  const handleSubmit = async (values: Recordable) => {
    requestTableData(values)
  }

  onMounted(() => {
    requestTableData()
  })

  /**
   * 对外暴露方法
   */
  defineExpose({
    reload: requestTableData,
    form,
    table,
  })
</script>
<style scoped lang="less">
  .proDataTable {
    :deep(.n-data-table-wrapper) {
      border-radius: 15px;
    }
  }

  .pro-data-table {
    :deep(.n-data-table-th) {
      font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 0.5rem 1rem; /* py-2 px-4 */
      color: #4c4f57;
      font-weight: 500;
      font-size: 16px;
      line-height: 16px;
    }

    :deep(.n-data-table-td) {
      font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 0.625rem 1rem; /* py-2.5 px-4 */
      font-weight: 400;
      font-size: 16px;
      line-height: 16px;
    }

    :deep(.n-data-table-th__title) {
      font-weight: 500;
    }

    :deep(.table-position-text) {
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-all;
    }

    :deep(.ad-action-btn) {
      --ad-btn-color: #3a82f9;
      border-radius: 4px;
      border-color: var(--ad-btn-color);
      color: var(--ad-btn-color);
      background-color: transparent;
    }

    :deep(.ad-action-btn:hover) {
      background-color: var(--ad-btn-color);
      color: #ffffff !important;
      border-color: var(--ad-btn-color);
    }

    :deep(.n-data-table.n-data-table--bottom-bordered .n-data-table-td.n-data-table-td--last-row) {
      border-bottom: none;
    }
  }
</style>

<template>
  <div class="mt-3">
    <Header :title="title" :noWrapperStyle="restProps.noWrapperStyle">
      <template #filterForm>
        <Form
          ref="formRef"
          :columns="columns"
          :formProps="formProps"
          @onValueChange="requestTableData"
          @submit="handleSubmit"
        ></Form>
      </template>
      <template #content>
        <n-data-table
          ref="tableRef"
          :class="{
            'pro-data-table': !title && true,
          }"
          :data="list"
          :columns="columns"
          :bordered="true"
          :loading="loading"
          :pagination="false"
          v-bind="restProps"
        >
        </n-data-table>
        <Pagination :paginationProps="pagination" :pagination="props.pagination"></Pagination>
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
</style>

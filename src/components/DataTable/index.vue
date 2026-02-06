<template>
  <div class="mt-3">
    <Section :hidden-title="hiddenTitle" :hidden-toolbar="hiddenToolbar">
      <template #title>
        <slot name="title"></slot>
      </template>
      <template #toolbar>
        <slot name="toolbar"></slot>
      </template>
      <template #content>
        <n-data-table
          :data="list"
          :columns="columns"
          :bordered="true"
          :loading="loading"
          :pagination="false"
          v-bind="restProps"
        >
        </n-data-table>
        <div class="n-data-pagination flex justify-end p-4">
          <n-pagination v-bind="pagination"></n-pagination>
        </div>
      </template>
    </Section>
  </div>
</template>
<script lang="ts" setup>
  import { useAttrs } from 'vue'
  import { DataTableProps } from './types'
  import Section from '@/components/Section/index.vue'

  const restProps = useAttrs()

  const emit = defineEmits(['update-page', 'update-page-size', 'data-table'])

  const props = withDefaults(defineProps<DataTableProps>(), {
    hiddenTitle: false,
    hiddenToolbar: false,
    data: () => [],
    columns: () => [],
  })

  // table数据
  const list = ref<Array<Recordable>>([])
  // 加载状态
  const loading = ref(false)

  /**
   * 分页参数
   */
  const pagination = reactive({
    itemCount: 0,
    pageSize: 10,
    page: 1,
    prefix: ({ itemCount }) => {
      return h('div', {}, itemCount ? `共计 ${pagination.itemCount} 条数据` : '')
    },
    showSizePicker: false,
    onUpdatePage: (page: number) => {
      updatePage(page)
    },
    onUpdatePageSize: (pageSize: number) => {
      updatePageSize(pageSize)
    },
  })

  /**
   * 请求表格数据
   * @param params
   */
  const requestTableData = async (params?: Recordable) => {
    loading.value = true

    try {
      const paginationParams = {
        pageNo: pagination.page,
        pageSize: pagination.pageSize,
      }

      const payload = {
        ...paginationParams,
        ...params,
      }

      const res = await props.request({ ...payload })
      loading.value = false

      if (res.code === 0) {
        list.value = res.data.dataList
        emit('data-table', res.data.dataList)
        pagination.page = payload.pageNo
        pagination.itemCount = res.data.total
        pagination.pageSize = res.data.size
      } else {
        list.value = []
        pagination.itemCount = 0
        pagination.pageSize = 10
        pagination.page = 1
      }
    } catch (err) {
      loading.value = false
    }
  }

  //页码切换
  function updatePage(page) {
    pagination.page = page
    requestTableData({ pageNo: pagination.page })
  }

  //分页数量切换
  function updatePageSize(size) {
    emit('update-page-size', size)
    pagination.pageSize = size
    requestTableData({ pageSize: pagination.pageSize })
  }

  onMounted(() => {
    requestTableData()
  })

  /**
   * 对外暴露方法
   */
  defineExpose({
    reload: requestTableData,
  })
</script>
<style lang="less">
  .n-data-pagination {
    & .n-data-table__pagination {
      margin: 12px !important;
    }

    & .n-pagination {
      position: relative;
      width: 100%;
      justify-content: end;

      & .n-pagination-prefix {
        position: absolute;
        bottom: 5px;
        left: 0;
      }
    }
  }
</style>

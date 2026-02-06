<template>
  <div>
    <pro-table
      ref="apiRef"
      :columns="tableData"
      :actions="actions"
      :actionProps="actionProps"
      :request="page"
      useScrollX
      visibleMerchant
      :permissions="['system:user:query']"
    >
      <template #tableTitle>
        <n-button type="primary" v-permission="['system:user:create']" @click="handleclick()">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增
        </n-button>
      </template>
    </pro-table>
  </div>
</template>

<script setup>
  import { useColumns, useFormSchemas } from './useData'
  import { page, add, update, del, getGoogleKey, updateUserStatus } from './useApi'
  import { getRoleDownBox } from '@/api/common'
  import { PlusOutlined } from '@vicons/antd'
  import GoogleKey from './components/GoogleKey.vue'

  const { showModal, confirmAction } = useFeedback()

  const apiRef = useTemplateRef('apiRef')
  const formRef = ref(null)
  const roleDownBox = ref([])

  const reload = () => apiRef.value?.table?.reload?.()

  const handleclick = async (record) => {
    const schemas = computed(() => useFormSchemas(roleDownBox, record))

    const submit = async (e) => {
      if (e) {
        const payload = record ? { ...e, id: record.id } : e
        useAsync(() => (record ? update(payload) : add(payload)), formRef.value.form, [
          reload,
          d.destroy,
        ])
      }
    }

    let d = null
    d = showModal({
      ...(record && { title: '编辑' }),
      content: (Component) => {
        return h(Component, {
          ref: formRef,
          schemas: schemas.value,
          onSubmit: submit,
          onClose: () => d?.destroy(),
          record,
        })
      },
    })
  }

  const handleDelete = ({ id }) =>
    confirmAction({ api: del, params: { id }, reload, type: 'error' })

  const handleOpen = async ({ id }) => {
    const loading = ref(true)
    const info = ref()

    let d
    d = showModal({
      title: '查看谷歌密钥',
      content: () => {
        return h(GoogleKey, {
          onClose: () => d?.destroy(),
          loading: loading.value,
          info: info.value,
        })
      },
    })

    // 异步加载角色数据
    try {
      const res = await getGoogleKey({ id })
      if (res?.code === 0) {
        info.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  const handleUpdateStatus = ({ id, status }) =>
    confirmAction({
      api: updateUserStatus,
      params: { id, status: status ? 0 : 1 },
      reload,
      type: status ? 'error' : 'success',
      content: status ? '是否禁用？' : '是否启用？',
    })

  const actionProps = { width: 310 }

  const actions = [
    {
      label: '编辑',
      type: 'info',
      auth: ['system:user:update'],
      onClick: handleclick,
      ifShow: (row) => row.adminId !== '1',
    },
    {
      label: (row) => (row.status ? '禁用' : '启用'),
      type: (row) => (row.status ? 'error' : 'success'),
      auth: ['system:user:status'],
      onClick: handleUpdateStatus,
      ifShow: (row) => row.adminId !== '1',
    },
    {
      label: '删除',
      type: 'error',
      auth: ['system:user:delete'],
      onClick: handleDelete,
      ifShow: (row) => row.adminId !== '1',
    },
    {
      label: '查看谷歌密钥',
      type: 'info',
      auth: ['system:user:show-google'],
      onClick: handleOpen,
    },
  ]

  const tableData = computed(() => useColumns(roleDownBox))

  onMounted(async () => {
    const res = await getRoleDownBox()
    if (res?.code === 0) {
      roleDownBox.value = res.data ?? []
    }
  })
</script>

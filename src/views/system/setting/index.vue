<template>
  <div>
    <pro-table
      ref="apiRef"
      :columns="columns"
      :actions="actions"
      :actionProps="actionProps"
      :request="page"
      useScrollX
      visibleMerchant
      :permissions="['system:config:query']"
    >
      <template #tableTitle>
        <n-button type="primary" v-permission="['system:config:create']" @click="handleclick()">
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
  import { columns, schemas } from './useData'
  import { page, add, update, del } from './useApi'
  import { computed, onMounted, useTemplateRef } from 'vue'
  import { PlusOutlined } from '@vicons/antd'
  import { useUserStore } from '@/store/modules/user'
  import { storeToRefs } from 'pinia'
  import { transformTree } from '@/utils'

  const userStore = useUserStore()
  const { info } = storeToRefs(userStore)

  const { showModal, confirmAction } = useFeedback()

  const apiRef = useTemplateRef('apiRef')
  const menus = ref([])
  const merchantScopeList = ref([])
  const productScopeList = ref([])

  const reload = () => apiRef.value?.table?.reload?.()

  const handleclick = async (record) => {
    const formRef = ref(null)

    const submit = async (e) => {
      if (e) {
        const payload = record ? { ...e, id: record.id } : e
        useAsync(() => (record ? update(payload) : add(payload)), formRef.value.form, [
          reload,
          d.destroy,
        ])
      }
    }

    let d
    d = showModal({
      ...(record && { title: '编辑' }),
      content: (Component) => {
        return h(Component, {
          ref: formRef,
          schemas,
          onSubmit: submit,
          onClose: () => d?.destroy(),
          record,
        })
      },
    })
  }

  const handleDelete = ({ id }) =>
    confirmAction({ api: del, params: id, reload, type: 'error' })

  const actionProps = { width: 140 }

  const actions = [
    {
      label: '编辑',
      type: 'info',
      auth: ['system:config:update'],
      onClick: handleclick,
    },
    {
      label: '删除',
      type: 'error',
      auth: ['system:config:delete'],
      onClick: handleDelete,
    },
  ]
</script>

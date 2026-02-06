<template>
  <div>
    <pro-table ref="apiRef" :columns="columns" :actions="actions" :actionProps="actionProps" :request="page" useScrollX
      visibleMerchant :permissions="['system:role:query']">
      <template #tableTitle>
        <n-button type="primary" v-permission="['system:role:create']" @click="handleclick()">
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
import { columns, schemas, useFuncSchemas, useDataSchemas } from './useData'
import {
  page,
  add,
  update,
  del,
  updateRoleStatus,
  getMenuTree,
  updateMenuTree,
  getDataScope,
  updateDataScope,
} from './useApi'
import { computed, onMounted, useTemplateRef } from 'vue'
import { PlusOutlined } from '@vicons/antd'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { transformTree, getTreeAll } from '@/utils'
import { defineOptions } from 'vue'

defineOptions({
  name: 'role',
})

const userStore = useUserStore()
const { menus, merchantList, productList } = storeToRefs(userStore)

const { showModal, confirmAction } = useFeedback()

const apiRef = useTemplateRef('apiRef')
const merchantScopeList = ref([])
const productScopeList = ref([])
const current = ref([])
const ids = ref([])

const reload = () => apiRef.value?.table?.reload?.()

const onUpdateValue = (e) => {
  if (e?.length) {
    current.value = productList.value?.filter((item) => e.includes(item.key))
  }
}

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
  confirmAction({ api: del, params: { id }, reload, type: 'error' })

// 获取所有id
function collectAppCodes(list) {
  const result = []
  list.forEach((item) => {
    ; (item.productScopeList || []).forEach((p) => {
      result.push(p.appCode)
    })
  })
  return result
}

const handleUpdateStatus = ({ id, status }) =>
  confirmAction({
    api: updateRoleStatus,
    params: { id, status: status ? 0 : 1 },
    reload,
    type: status ? 'error' : 'success',
    content: status ? '是否禁用？' : '是否启用？',
  })

// 获取所有children非空的父节点id
const getAllParentIds = (data = []) => {
  const parentIds = []
  data.forEach((item) => {
    if (item.children && item.children.length) {
      parentIds.push(item.id)
      parentIds.push(...getAllParentIds(item.children))
    }
  })
  return parentIds
}

const handleFunc = async (record) => {
  const formRef = ref(null)
  const loading = ref(true)

  const schemas = useFuncSchemas(menus)
  const parentIds = getAllParentIds(menus.value)

  const submit = async (e) => {
    if (e) {
      useAsync(() => updateMenuTree({ ...e, id: record.id }), formRef.value.form, [
        reload,
        d.destroy,
      ])
    }
  }

  let d
  d = showModal({
    title: '功能权限',
    style: { width: '600px' },
    content: (Component) => {
      return h(Component, {
        ref: formRef,
        schemas,
        onSubmit: submit,
        onClose: () => d?.destroy(),
        record: { menuIds: ids.value },
        loading: loading.value,
      })
    },
  })

  try {
    const res = await getMenuTree({ id: record.id })
    if (res?.code === 0) {
      ids.value = res.data?.filter((item) => !parentIds.includes(item)) ?? []
    }
  } finally {
    loading.value = false
  }
}

const handleData = async (record) => {
  const include = productList.value
    .filter((item) => item.productScopeList?.length)
    .map((i) => i.merchantCode)
  const merchantOptions = merchantList.value.filter((item) => include.includes(item.merchantCode))
  const schemas = computed(() => useDataSchemas(merchantOptions, onUpdateValue, current))
  const formRef = ref(null)
  const params = ref()
  const loading = ref(true)

  const submit = async (e) => {
    if (e) {
      const { product = [], merchantCodeList = [], ...rest } = e

      const arr = productList.value
        ?.filter((item) => merchantCodeList.includes(item.key))
        .map((i) => ({
          merchantCode: i.merchantCode,
          merchantName: i.merchantName,
          productScopeList: i.productScopeList
            ?.filter((p) => product.includes(p.appCode))
            .map((m) => ({
              id: m.id,
              appCode: m.appCode,
              appName: m.appName,
            })),
        }))

      const params = {
        ...rest,
        merchantCodeList,
        productList: arr,
      }

      const payload = record ? { ...params, id: record.id } : params
      useAsync(() => updateDataScope(payload), formRef.value.form, [reload, d.destroy])
    }
  }

  const onClose = () => {
    d?.destroy()
    params.value = null
    current.value = []
  }

  let d
  d = showModal({
    title: '数据权限',
    style: { width: '800px' },
    content: (Component) => {
      return h(Component, {
        ref: formRef,
        schemas: schemas.value,
        onSubmit: submit,
        onClose,
        record: params.value,
        loading: loading.value,
      })
    },
  })

  try {
    const res = await getDataScope({ id: record.id })
    if (res?.code === 0) {
      const merchantCodeList = res.data.merchantScopeList.map((item) => item.merchantCode) ?? []
      const productScopeList = res.data.productScopeList?.map((item) => ({
        ...item,
        key: item.merchantCode,
        label: item.merchantName,
        children: item.productScopeList?.map((p) => ({
          ...p,
          key: p.appCode,
          label: p.appName,
        })),
      }))
      const product = collectAppCodes(res.data.productScopeList) ?? []
      onUpdateValue(merchantCodeList)
      params.value = { merchantCodeList, product }
    }
  } finally {
    loading.value = false
  }
}

const actionProps = { width: 360 }

const actions = [
  {
    label: '编辑',
    type: 'info',
    auth: ['system:role:update'],
    onClick: handleclick,
    ifShow: (row) => row.id !== 1,
  },
  {
    label: (row) => (row.status ? '禁用' : '启用'),
    type: (row) => (row.status ? 'error' : 'success'),
    auth: ['system:role:status'],
    onClick: handleUpdateStatus,
    ifShow: (row) => row.id !== 1,
  },
  {
    label: '删除',
    type: 'error',
    auth: ['system:role:delete'],
    onClick: handleDelete,
    ifShow: (row) => row.id !== 1,
  },
  {
    label: '功能权限',
    type: 'info',
    auth: ['system:role:update'],
    onClick: handleFunc,
    ifShow: (row) => row.id !== 1,
  },
  {
    label: '数据权限',
    type: 'info',
    auth: ['system:role:update'],
    onClick: handleData,
    ifShow: (row) => row.id !== 1,
  },
]
</script>

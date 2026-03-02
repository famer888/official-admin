<template>
  <div class="p-4 bg-white rounded-[8px]">
    <div
      class="relative h-[120px] p-[24px] bg-[url(@/assets/images/payment-banner.png)] bg-cover bg-center rounded-[8px] flex items-center justify-between"
    >
      <div class="text-[32px] text-white">
        <div>存入资金</div>
        <div>以便随时开启您的广告推广！</div>
      </div>
      <div>
        <n-button
          class="w-[192px] h-[48px] rounded-[4px] bg-white text-[#3A82F9]"
          @click="handleClick"
          >存款</n-button
        >
      </div>
    </div>
    <div class="mt-5">
      <div class="text-base font-bold">存款记录</div>
      <pro-data-table
        ref="tableRef"
        :columns="columns"
        :request="run"
        :bordered="false"
        :noWrapperStyle="true"
      />
    </div>
  </div>
</template>
<script setup>
  import { getColumns } from './useData'
  import { getRechargeOrderPage } from './useApi'
  import { useRequest } from '@/composables/useRequest'
  import { useDialog } from 'naive-ui'
  import Deposit from './components/Deposit.vue'
  import { useUser } from '@/store/modules/user'
  import { provide } from 'vue'

  const dialog = useDialog()
  const user = useUser()
  const tableRef = ref('')

  const columns = computed(() => getColumns(tableRef.value.reload))
  const { run } = useRequest(getRechargeOrderPage, { manual: true })

  const handleClick = () => {
    dialog.create({
      class: 'upload-image-container',
      titleClass: 'text-center font-bold',
      showIcon: false,
      title: () => h('div', { class: 'w-full text-[16px]' }, '存入资金'),
      content: () =>
        h(Deposit, {
          onCancel: handleCancel,
        }),
      class: 'w-[600px]',
    })
  }

  const handleCancel = () => {
    dialog.destroyAll()
    tableRef.value?.reload()
  }

  const handleSubmit = (values) => {
    dialog.destroyAll()
  }

  onMounted(() => {
    user.useAllOptions()
  })
</script>

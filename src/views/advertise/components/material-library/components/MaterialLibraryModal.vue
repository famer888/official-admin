<!--
  素材库弹窗内容
  Props:
    - ratio: 当前创意要求的图片比例，如 "4:3"
    - onSelect: 选中素材后回调
    - onCancel: 取消关闭
-->
<template>
  <div class="flex flex-col">
    <!-- 自定义标题栏：背景 #E8EDF8 高度 56px -->
    <!-- 内容区域 -->
    <div class="p-5 flex flex-col">
      <!-- 图片比例提示：16px #455980 -->
      <div class="text-base font-medium text-[#455980] mb-4">
        图片比例（{{ ratio }}）
      </div>

      <!-- 搜索栏 -->
      <div class="flex items-center gap-3 mb-4">
        <span class="text-base font-medium text-[#1D2129] whitespace-nowrap">素材名称</span>
        <n-input
          v-model:value="searchName"
          placeholder="请输入素材名称"
          clearable
          :theme-overrides="inputTheme"
          class="w-[260px] h-[42px] rounded"
        />
        <span class="text-base font-medium text-[#1D2129] whitespace-nowrap">素材类型</span>
        <n-select
          v-model:value="searchType"
          :options="typeOptions"
          placeholder="请选择素材类型"
          clearable
          class="w-[200px]"
        />
        <n-button type="primary" class="h-[42px] rounded w-[96px]" @click="handleSearch">
          查询
        </n-button>
      </div>

      <!-- 表格 -->
      <n-data-table
        :columns="columns"
        :data="tableData"
        :row-key="(row) => row.id"
        :checked-row-keys="checkedKeys"
        :max-height="380"
        :single-line="true"
        @update:checked-row-keys="handleCheck"
      />

      <!-- 分页 -->
      <div class="flex items-center justify-center mt-4">
        <n-pagination
          v-model:page="currentPage"
          v-model:page-size="pageSize"
          :item-count="total"
          :page-sizes="[10, 20, 50]"
          show-size-picker
          show-quick-jumper
          :prefix="() => `共${total}条记录`"
          @update:page="loadData"
          @update:page-size="handlePageSizeChange"
        />
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-center gap-5 mt-5">
        <n-button
          ghost
          color="#3A82F9"
          class="w-[160px] h-[42px] rounded text-base font-medium"
          @click="$emit('cancel')"
        >
          取消
        </n-button>
        <n-button
          type="primary"
          class="w-[160px] h-[42px] rounded text-base font-medium"
          @click="handleConfirm"
        >
          确定
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { h } from 'vue'

  const props = defineProps({
    ratio: { type: String, default: '' },
  })

  const emit = defineEmits(['select', 'cancel'])

  const inputTheme = {
    color: '#F4F5F9',
    colorFocus: '#F4F5F9',
    border: '0 solid transparent',
    borderHover: '0 solid transparent',
    borderFocus: '0 solid transparent',
    boxShadowFocus: 'none',
    placeholderColor: '#86909C',
  }

  const searchName = ref('')
  const searchType = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(100)
  const checkedKeys = ref([])
  const tableData = ref([])

  /** 素材类型选项 */
  const typeOptions = [
    { label: '炮台', value: '炮台' },
    { label: '播放器', value: '播放器' },
    { label: '药台', value: '药台' },
    { label: '直播', value: '直播' },
    { label: 'BC', value: 'BC' },
  ]

  /** 表格列定义 */
  const columns = [
    { type: 'selection', width: 60, title: '选择' },
    { title: '素材ID', key: 'id', width: 100 },
    { title: '素材名称', key: 'name', width: 260 },
    { title: '素材类型', key: 'type', width: 120, align: 'center' },
    {
      title: '素材预览',
      key: 'previewUrl',
      width: 120,
      align: 'center',
      render: (row) =>
        h('img', {
          src: row.previewUrl,
          alt: row.name,
          class: 'w-[50px] h-[50px] rounded object-cover mx-auto',
        }),
    },
    { title: '图片尺寸', key: 'size', width: 120, align: 'right' },
  ]

  /** 生成 Mock 数据 */
  function generateMockData() {
    const types = ['炮台', '播放器', '药台', '直播', 'BC']
    const sizes = ['750*1280', '400*300', '750*300', '400*300', '750*180']
    const list = []
    for (let i = 0; i < total.value; i++) {
      const idx = i % types.length
      list.push({
        id: 10010 - i,
        name: `萝莉岛启动页-750*1080`,
        type: types[idx],
        previewUrl: 'https://www.gravatar.com/avatar/01cd8eec653036baa0d0ce5bcf4d45913c97fc91fe0d93543ae8ce8a094e3c2a?s=80&d=identicon',
        size: sizes[idx],
      })
    }
    return list
  }

  const fullData = generateMockData()

  /** 加载分页数据 */
  function loadData() {
    let filtered = fullData
    if (searchName.value) {
      filtered = filtered.filter((item) => item.name.includes(searchName.value))
    }
    if (searchType.value) {
      filtered = filtered.filter((item) => item.type === searchType.value)
    }
    total.value = filtered.length
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filtered.slice(start, start + pageSize.value)
  }

  function handleSearch() {
    currentPage.value = 1
    loadData()
  }

  function handlePageSizeChange() {
    currentPage.value = 1
    loadData()
  }

  function handleCheck(keys) {
    checkedKeys.value = keys
  }

  /** 确认选择 */
  function handleConfirm() {
    const selected = fullData.filter((item) => checkedKeys.value.includes(item.id))
    if (!selected.length) {
      window.$message?.warning('请至少选择一个素材')
      return
    }
    emit('select', selected[selected.length - 1])
  }

  loadData()
</script>

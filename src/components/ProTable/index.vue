<template>
  <!-- ProTable 组件：集成了查询表单和数据表格的高级表格组件 -->
  <div class="pro-table" v-bind="containerProps">
    <!-- 有权限时显示表格 -->
    <n-card :bordered="false" class="proCard" style="overflow: visible" v-if="show">
      <!-- 查询表单：用于筛选和搜索数据 -->
      <BasicForm
        ref="formRef"
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
        class="mb-4"
      />
      <!-- 数据表格：展示数据列表 -->
      <BasicTable
        ref="tableRef"
        :request="loadDataTable"
        :columns="tableColumns"
        v-bind="bindProps"
        @update:checked-row-keys="handleCheck"
        @update-page="updatePage"
      >
        <!-- 表格标题插槽：可自定义表格标题区域 -->
        <template #tableTitle>
          <slot name="tableTitle"></slot>
        </template>
        <!-- 工具栏插槽：可自定义工具栏区域 -->
        <template #toolbar>
          <slot name="toolbar"></slot>
        </template>
      </BasicTable>
    </n-card>
    <!-- 无权限时显示空状态 -->
    <n-card v-else class="proCard no-access">
      <n-empty description="暂无访问权限" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable } from '@/components/Table'
  import { BasicForm } from '@/components/Form/index'
  import { useProTable } from './hooks/useProTable'
  import type { ProTableProps } from './types'

  // 获取组件属性
  const attr = useAttrs()

  /**
   * Props 定义
   * @property {Object} tableProps - 表格属性配置
   * @property {Array} columns - 表格列配置
   * @property {Array} actions - 操作按钮配置
   * @property {Array} permissions - 权限编码数组
   * @property {Function} request - 数据请求函数
   * @property {Object} actionProps - 操作列属性配置
   * @property {Object} formProps - 表单属性配置
   * @property {Boolean} useScrollX - 是否启用横向滚动
   * @property {Boolean} visibleMerchant - 是否隐藏商户列
   * @property {Boolean} selection - 是否显示选择框列
   * @property {Object} selectionProps - 选择框列属性配置
   * @property {Object} merchantComponentProps - 商户选择组件属性
   * @property {Object} merchantProps - 商户列属性配置
   * @property {Object} containerProps - 容器属性配置
   */
  const props = withDefaults(defineProps<ProTableProps>(), {
    tableProps: () => ({}),
    columns: () => [],
    actions: () => [],
    permissions: () => [],
    request: async () => ({ code: 0, data: { current: 1, dataList: [], total: 0 } }),
    actionProps: () => ({}),
    formProps: () => ({}),
    useScrollX: false,
    visibleMerchant: false,
    selection: false,
    selectionProps: () => ({}),
    merchantComponentProps: () => ({}),
    merchantProps: () => ({}),
    containerProps: () => ({}),
  })

  /**
   * 事件定义
   * @event merchantChange - 商户选择变化事件
   * @event change - 表格数据变化事件
   * @event update:checked-row-keys - 选中行变化事件
   * @event reset - 表单重置事件
   * @event edit-end - 编辑结束事件
   * @event edit-change - 编辑变化事件
   */
  const emits = defineEmits<{
    merchantChange: [value: any]
    change: [data: any]
    'update:checked-row-keys': [keys: any[], records: any[]]
    reset: []
    'edit-end': [data: any]
    'edit-change': [data: any]
  }>()

  /**
   * 使用 ProTable Hook
   * 抽离了所有业务逻辑，包括：
   * - 权限控制
   * - 表单和表格的联动
   * - 数据加载和处理
   * - 操作列的动态渲染
   * - 商户筛选功能
   */
  const {
    show, // 是否显示表格
    form, // 表单实例引用
    table, // 表格实例引用
    tableColumns, // 处理后的表格列配置
    bindProps, // 表格绑定属性
    loadDataTable, // 数据加载函数
    register, // 表单注册函数
    setFieldsValue, // 设置表单字段值
    handleSubmit, // 查询提交处理
    handleReset, // 重置处理
    handleCheck, // 选择框变化处理
    updatePage, // 分页更新处理
  } = useProTable(props, emits, attr)

  /**
   * 暴露给父组件的方法和实例
   * @expose {Object} table - 表格实例，可调用表格方法（如 reload、updatePage 等）
   * @expose {Object} form - 表单实例，可调用表单方法
   * @expose {Function} setFieldsValue - 设置表单字段值的方法
   */
  defineExpose({ table, form, setFieldsValue })
</script>

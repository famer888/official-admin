<template>
    <div class="pro-table">
        <n-card :bordered="false" class="proCard" style="overflow: visible" v-if="show">
            <BasicForm ref="formRef" class="mb-6" @register="register" @submit="handleSubmit" @reset="handleSubmit" />
            <BasicTable ref="tableRef" :request="loadDataTable" :columns="tableColumns" v-bind="bindProps"
                @update:checked-row-keys="handleCheck">
                <template #tableTitle>
                    <slot name="tableTitle"></slot>
                </template>
                <template #toolbar>
                    <slot name="toolbar"></slot>
                </template>
            </BasicTable>
        </n-card>
        <n-card v-else class="proCard no-access">
            <n-empty description="暂无访问权限" />
        </n-card>
    </div>
</template>

<script setup>
import { reactive, h, computed, useTemplateRef } from 'vue'
import { BasicTable, TableAction } from '@/components/Table'
import { BasicForm, useForm } from '@/components/Form/index'
import { processTableData, useFormData } from './utils'
import { removeEmptyString } from '../ProForm/utils'
import { usePermission } from '@/hooks/web/usePermission'

const attr = useAttrs()

const props = defineProps({
    tableProps: {
        type: Object,
        default: () => ({}),
    },
    columns: {
        type: Array,
        default: () => [],
    },
    actions: {
        type: Array,
        default: () => [],
    },
    permissions: {
        type: Array,
        default: () => [],
    },
    request: {
        type: Function,
        default: async () => ({ code: 0, data: { current: 1, dataList: [], total: 0 } }),
    },
    actionProps: {
        type: Object,
        default: () => ({}),
    },
    formProps: {
        type: Object,
        default: () => ({}),
    },
    useScrollX: {
        type: Boolean,
        default: false,
    },
    visibleMerchant: {
        type: Boolean,
        default: false,
    },
    selection: {
        type: Boolean,
        default: false,
    },
    selectionProps: {
        type: Object,
        default: () => ({}),
    },
})

const emits = defineEmits(['merchantChange', 'change', 'update:checked-row-keys'])

const { hasPermission } = usePermission()
const show = computed(() => hasPermission(props.permissions))

const form = useTemplateRef('formRef')
const table = useTemplateRef('tableRef')

let lastMerchant = null

const merchantChange = (e) => {
    if (e === lastMerchant) return // 值没变，不触发
    lastMerchant = e
    emits('merchantChange', e)
}

const handleCheck = (keys, records) => {
    emits('update:checked-row-keys', keys, records)
}

const tableColumns = computed(() =>
    processTableData({
        columns: props.columns,
        visibleMerchant: props.visibleMerchant,
        selection: props.selection,
        merchantChange,
        selectionProps: props.selectionProps,
    })
)

const mapActions = (record) =>
    (props.actions || []).map((item) => ({
        ...item,
        onClick: () => item.onClick(record),
        label: typeof item.label === 'string' ? item.label : item.label(record),
        type: typeof item.type === 'string' ? item.type : item.type(record),
        ifShow: item.ifShow ? item.ifShow(record) : true,
    }))

const actionColumn = reactive({
    width: 100,
    title: '操作',
    align: 'center',
    key: 'action',
    fixed: 'right',
    render(record) {
        return h(TableAction, {
            style: 'button',
            actions: mapActions(record),
        })
    },
    ...props.actionProps,
})

const scrollBind = computed(() =>
    props.useScrollX
        ? {
            scrollX:
                tableColumns.value.reduce((sum, item) => sum + (item.width || 0), 0) +
                (props.actions.length ? actionColumn?.width : 0),
        }
        : {}
)

const bindProps = computed(() => ({
    ...props.tableProps,
    ...scrollBind.value,
    ...(props.actions.length ? { actionColumn } : {}),
    ...attr,
}))

const loadDataTable = async (e) => {
    const params = removeEmptyString(getFieldsValue())
    const res = await props?.request({
        ...e,
        ...params,
    })
    if (res?.code === 0) {
        const d = res.data || {}
        const data = {
            ...d,
            pageNo: d.pageNo ?? d.current ?? 1,
            pageCount: Math.ceil(d.total / d.size),
        }
        emits('change', data)
        return data
    }
}

const schemas = useFormData(props.columns, props.visibleMerchant, merchantChange)

const [register, { getFieldsValue, setFieldsValue }] = useForm({
    gridProps: { cols: '1 s:2 m:3 l:4 xl:5 2xl:6', xGap: '16px' },
    collapsedRows: 5,
    schemas,
    labelWidth: 75,
    ...props.formProps,
})

let lastQuery = {}

const handleSubmit = () => {
    const params = removeEmptyString(getFieldsValue())
    if (JSON.stringify(lastQuery) !== JSON.stringify(params)) {
        lastQuery = params
        table.value?.updatePage?.(1)
    } else {
        table.value?.reload()
    }
}

defineExpose({ table, form, setFieldsValue })
</script>

<style scoped lang="less">
.pro-table {
    :deep(.n-data-table-table) {
        .n-data-table-th {
            // background: #f2f3f5;
        }
    }
}
</style>
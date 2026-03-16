/**
 * 广告管理 - 列表页表格配置
 * 定义表格列、状态映射、操作按钮渲染逻辑
 */
import { defineComponent, h, ref } from 'vue'
import { NButton, NSpace } from 'naive-ui'
import router from '@/router'

/** 广告计划状态 → 标签文案 & 颜色 */
const statusMap = {
  0: { label: '草稿', color: '#999999' },
  1: { label: '审核中', color: '#4271BD' },
  2: { label: '审核不通过', color: '#C42527' },
  3: { label: '投放中', color: '#57AC22' },
  4: { label: '投放结束', color: '#626262' },
  5: { label: '投放未开始', color: '#A95656' },
}

/** 操作按钮颜色映射 */
const btnColorMap = {
  primary: '#3A82F9',
  success: '#1BAD64',
  error: '#FF292D',
  warning: '#F9A33A',
  tertiary: '#999999',
  info: '#4A36FF',
}

/** 创建统一风格的操作按钮 */
function createBtn(text, { type = 'primary', ghost = true, onClick }) {
  const color = btnColorMap[type] || btnColorMap.primary

  // 需求：默认 ghost；hover 时变成非 ghost（填充背景），且文案白色
  return h(
    defineComponent({
      name: 'HoverGhostButton',
      setup() {
        const hovered = ref(false)
        return () =>
          h(
            NButton,
            {
              ghost: hovered.value ? false : ghost,
              color: btnColorMap[type] || btnColorMap.primary,
              textColor: hovered.value ? '#FFFFFF' : undefined,
              size: 'small',
              class: 'rounded',
              onMouseenter: () => (hovered.value = true),
              onMouseleave: () => (hovered.value = false),
              onClick,
            },
            { default: () => text }
          )
      },
    })
  )
}

/** 提交审核确认弹窗（340×226 / radius 16） */
function showSubmitReviewDialog(row, reload) {
  window.$dialog?.create({
    showIcon: false,
    closable: false,
    class: 'w-[340px] h-[226px] p-0 rounded-2xl overflow-hidden',
    content: () =>
      h('div', { class: 'w-[340px] h-[226px] p-5 box-border flex flex-col justify-between' }, [
        h('div', { class: 'text-center text-xl font-bold text-black pt-5' }, '是否提交审核？'),
        h('div', { class: 'flex gap-5' }, [
          h(
            NButton,
            {
              ghost: true,
              color: '#3A82F9',
              class: 'flex-1 h-[42px] text-base rounded font-medium',
              onClick: () => window.$dialog?.destroyAll(),
            },
            { default: () => '取消' }
          ),
          h(
            NButton,
            {
              type: 'primary',
              class: 'flex-1 h-[42px] text-base rounded font-medium',
              onClick: () => {
                window.$dialog?.destroyAll()
                window.$message?.success('提交审核成功')
                reload?.()
              },
            },
            { default: () => '确认' }
          ),
        ]),
      ]),
  })
}

/** 审核驳回原因展示弹窗（340×226 / radius 16） */
function showRejectReasonDialog(row) {
  const reason = row.rejectReason || '广告素材过于劲爆，无法满足APP审核规范\n请立即整改！'
  window.$dialog?.create({
    showIcon: false,
    closable: false,
    class: 'w-[340px] h-[226px] p-0 rounded-2xl overflow-hidden',
    content: () =>
      h('div', { class: 'w-[340px] h-[226px] px-[18px] py-5 box-border flex flex-col justify-between' }, [
        h('div', { class: 'text-center text-xl font-bold text-black pt-3' }, '审核驳回原因'),
        h(
          'div',
          { class: 'text-base leading-[26px] text-center whitespace-pre-line text-[#1D2129]' },
          reason
        ),
        h('div', { class: 'flex justify-center' }, [
          h(
            NButton,
            {
              ghost: true,
              color: '#3276FF',
              class: 'w-[196px] h-[42px] text-base rounded font-medium',
              onClick: () => window.$dialog?.destroyAll(),
            },
            { default: () => '关闭' }
          ),
        ]),
      ]),
  })
}

/** 跳转到编辑页 */
function goEdit(row) {
  router
    .push({
      path: '/advertise/edit',
      query: { id: row.id, planName: row.planName, position: row.position },
    })
    .catch((err) => console.error('[advertise] goEdit failed:', err))
}

/** 跳转到详情页 */
function goDetail(row) {
  router
    .push({
      path: '/advertise/detail',
      query: { id: row.id, planName: row.planName },
    })
    .catch((err) => console.error('[advertise] goDetail failed:', err))
}

/**
 * 根据行数据的状态渲染对应的操作按钮组
 * 不同状态下可执行的操作不同
 */
function renderActions(row, reload) {
  const actions = []
  const status = row.status

  switch (status) {
    case 0: // 草稿
    case 5: // 投放未开始
      actions.push(createBtn('编辑', { type: 'success', onClick: () => goEdit(row) }))
      actions.push(createBtn('提交审核', { type: 'primary', onClick: () => showSubmitReviewDialog(row, reload) }))
      break
    case 1: // 审核中
      actions.push(createBtn('查看', { type: 'info', onClick: () => goDetail(row) }))
      actions.push(createBtn('撤回', { type: 'error', onClick: () => window.$message?.info('已撤回') }))
      break
    case 2: // 审核不通过
      actions.push(createBtn('编辑', { type: 'success', onClick: () => goEdit(row) }))
      actions.push(createBtn('终止', { type: 'tertiary', onClick: () => window.$message?.info('已终止') }))
      break
    case 3: // 投放中
      actions.push(createBtn('暂停', { type: 'tertiary', onClick: () => window.$message?.info('已暂停') }))
      actions.push(createBtn('开启投放', { type: 'warning', onClick: () => window.$message?.info('已开启投放') }))
      break
    case 4: // 投放结束
      actions.push(createBtn('编辑', { type: 'success', onClick: () => goEdit(row) }))
      actions.push(createBtn('提交审核', { onClick: () => showSubmitReviewDialog(row, reload) }))
      break
  }

  // 有驳回原因时追加「驳回原因」按钮
  if (row.rejectReason) {
    actions.push(createBtn('驳回原因', { type: 'warning', onClick: () => showRejectReasonDialog(row) }))
  }

  return h(NSpace, { size: 8, justify: 'end', wrap: false }, { default: () => actions })
}

/**
 * 获取表格列定义
 * @param {Function} reload - 列表刷新回调，传给操作按钮使用
 */
export const getColumns = (reload) => [
  {
    title: '计划名称',
    key: 'planName',
    hideInTable: true,
    showFilter: true,
    component: 'NInput',
    componentProps: {
      placeholder: '关键字模糊查询',
    },
  },
  {
    title: '计划',
    key: 'id',
    width: 180,
    align: 'left',
  },
  {
    title: '计划名称',
    key: 'planName',
    width: 160,
    align: 'left',
    render: (row) => h('span', { class: 'font-semibold text-base leading-4 text-[#4C4F57]' }, row.planName),
  },
  {
    title: '投放周期',
    key: 'deliveryPeriod',
    width: 220,
    align: 'left',
    render: (row) => `${row.startDate}-${row.endDate}`,
  },
  {
    title: '投放预算',
    key: 'budget',
    width: 140,
    align: 'left',
    render: (row) =>
      h(
        'span',
        { class: 'font-bold text-base leading-4 text-[#FF292D] font-[DIN_Alternate]' },
        row.budget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      ),
  },
  {
    title: '投放位置',
    key: 'position',
    width: 250,
    align: 'left',
    render: (row) => h('div', { class: 'leading-5 line-clamp-2 break-all' }, row.position),
  },
  {
    title: '状态',
    key: 'status',
    width: 140,
    align: 'left',
    render: (row) => {
      const info = statusMap[row.status] || statusMap[0]
      return h(
        'span',
        {
          class: 'inline-flex justify-center items-center min-w-[96px] h-8 rounded border text-base whitespace-nowrap',
          style: { borderColor: info.color, color: info.color },
        },
        info.label
      )
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    align: 'right',
    render: (row) => renderActions(row, reload),
  },
]

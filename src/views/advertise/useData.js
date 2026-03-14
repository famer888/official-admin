import { h } from 'vue'
import { NButton, NSpace } from 'naive-ui'
import router from '@/router'

const statusMap = {
  0: { label: '草稿', color: '#999999' },
  1: { label: '审核中', color: '#4271BD' },
  2: { label: '审核不通过', color: '#C42527' },
  3: { label: '投放中', color: '#57AC22' },
  4: { label: '投放结束', color: '#626262' },
  5: { label: '投放未开始', color: '#A95656' },
}

const btnColorMap = {
  primary: '#3A82F9',
  success: '#1BAD64',
  error: '#FF292D',
  warning: '#F9A33A',
  tertiary: '#999999',
  info: '#4A36FF',
}

function createBtn(text, { type = 'primary', ghost = true, onClick }) {
  return h(
    NButton,
    {
      ghost,
      color: btnColorMap[type],
      size: 'small',
      class: '!rounded',
      onClick,
    },
    { default: () => text }
  )
}

function showSubmitReviewDialog(row, reload) {
  window.$dialog?.create({
    showIcon: false,
    closable: false,
    style: { width: '340px', height: '226px', padding: '20px', borderRadius: '16px' },
    title: () => h('div', { class: 'text-center text-xl font-bold text-black w-full pt-4' }, '是否提交审核？'),
    action: () =>
      h('div', { class: 'flex justify-between gap-5 w-full absolute bottom-5 left-5 right-5' }, [
        h(
          NButton,
          {
            ghost: true,
            color: '#3A82F9',
            class: 'flex-1 !h-[42px] !text-base !rounded !font-medium',
            onClick: () => window.$dialog?.destroyAll(),
          },
          { default: () => '取消' }
        ),
        h(
          NButton,
          {
            type: 'primary',
            class: 'flex-1 !h-[42px] !text-base !rounded !font-medium',
            onClick: () => {
              window.$dialog?.destroyAll()
              window.$message?.success('提交审核成功')
              reload?.()
            },
          },
          { default: () => '确认' }
        ),
      ]),
  })
}

function showRejectReasonDialog(row) {
  const reason = row.rejectReason || '广告素材过于劲爆，无法满足APP审核规范\n请立即整改！'
  window.$dialog?.create({
    showIcon: false,
    closable: false,
    style: { width: '340px', height: '226px', padding: '20px 18px', borderRadius: '16px' },
    title: () => h('div', { class: 'text-center text-xl font-bold text-black w-full pt-2' }, '审核驳回原因'),
    content: () =>
      h('div', { class: 'text-base leading-[26px] text-center whitespace-pre-line text-[#1D2129] pt-2 pb-5' }, reason),
    action: () =>
      h('div', { class: 'flex justify-center w-full pt-3 pb-5' }, [
        h(
          NButton,
          {
            ghost: true,
            color: '#3276FF',
            class: '!w-[196px] !h-[42px] !text-base !rounded !font-medium',
            onClick: () => window.$dialog?.destroyAll(),
          },
          { default: () => '关闭' }
        ),
      ]),
  })
}

function goEdit(row) {
  router.push({
    path: '/advertise/edit',
    query: { id: row.id, planName: row.planName, position: row.position },
  })
}

function goDetail(row) {
  router.push({
    path: '/advertise/detail',
    query: { id: row.id, planName: row.planName },
  })
}

function renderActions(row, reload) {
  const actions = []
  const status = row.status

  switch (status) {
    case 0:
    case 5:
      actions.push(createBtn('编辑', { type: 'success', onClick: () => goEdit(row) }))
      actions.push(createBtn('提交审核', { type: 'primary', onClick: () => showSubmitReviewDialog(row, reload) }))
      break
    case 1:
      actions.push(createBtn('查看', { type: 'info', onClick: () => goDetail(row) }))
      actions.push(createBtn('撤回', { type: 'error', onClick: () => window.$message?.info('已撤回') }))
      break
    case 2:
      actions.push(createBtn('编辑', { type: 'success', onClick: () => goEdit(row) }))
      actions.push(createBtn('终止', { type: 'tertiary', onClick: () => window.$message?.info('已终止') }))
      break
    case 3:
      actions.push(createBtn('暂停', { type: 'tertiary', onClick: () => window.$message?.info('已暂停') }))
      actions.push(createBtn('开启投放', { type: 'warning', onClick: () => window.$message?.info('已开启投放') }))
      break
    case 4:
      actions.push(createBtn('编辑', { type: 'success', onClick: () => goEdit(row) }))
      actions.push(createBtn('提交审核', { onClick: () => showSubmitReviewDialog(row, reload) }))
      break
  }

  if (row.rejectReason) {
    actions.push(createBtn('驳回原因', { type: 'warning', onClick: () => showRejectReasonDialog(row) }))
  }

  return h(NSpace, { size: 8, justify: 'end', wrap: false }, { default: () => actions })
}

export const getColumns = (reload) => [
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
    width: 200,
    align: 'left',
    render: (row) => h('div', { class: 'leading-5 line-clamp-2 break-all' }, row.position),
  },
  {
    title: '状态',
    key: 'status',
    width: 140,
    align: 'center',
    render: (row) => {
      const info = statusMap[row.status] || statusMap[0]
      return h(
        'span',
        {
          class: 'inline-flex justify-center items-center min-w-[96px] px-3 h-8 rounded border text-base whitespace-nowrap',
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

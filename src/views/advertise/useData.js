import { NButton, NTag, NSpace } from 'naive-ui'
import router from '@/router'

const statusMap = {
  0: { label: '草稿', type: 'default' },
  1: { label: '审核中', type: 'warning' },
  2: { label: '已通过', type: 'info' },
  3: { label: '投放中', type: 'success' },
  4: { label: '已终止', type: 'error' },
  5: { label: '已撤回', type: 'default' },
}

function createBtn(text, { type = 'primary', ghost = false, onClick }) {
  return h(
    NButton,
    { type, ghost, size: 'small', onClick },
    { default: () => text }
  )
}

function showSubmitReviewDialog(row, reload) {
  window.$dialog?.create({
    title: false,
    showIcon: false,
    closable: false,
    style: { width: '340px', height: '226px' },
    content: () =>
      h(
        'div',
        { class: 'flex flex-col items-center justify-center py-6' },
        [h('div', { class: 'text-xl font-bold text-[#333]' }, '是否提交审核？')]
      ),
    action: () =>
      h('div', { class: 'flex justify-center gap-4 w-full pb-2' }, [
        h(
          NButton,
          {
            ghost: true,
            type: 'primary',
            class: '!w-[120px] !h-[44px] !text-base',
            onClick: () => window.$dialog?.destroyAll(),
          },
          { default: () => '取消' }
        ),
        h(
          NButton,
          {
            type: 'primary',
            class: '!w-[120px] !h-[44px] !text-base',
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
    title: false,
    showIcon: false,
    closable: false,
    style: { width: '340px' },
    content: () =>
      h('div', { class: 'flex flex-col items-center py-4 px-2' }, [
        h('div', { class: 'text-xl font-bold text-[#333] mb-4' }, '审核驳回原因'),
        h(
          'div',
          { class: 'text-sm text-[#3A82F9] text-center whitespace-pre-line leading-6' },
          reason
        ),
      ]),
    action: () =>
      h('div', { class: 'flex justify-center w-full pb-2' }, [
        h(
          NButton,
          {
            ghost: true,
            type: 'primary',
            class: '!w-[160px] !h-[44px] !text-base',
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
      actions.push(createBtn('编辑', { ghost: true, onClick: () => goEdit(row) }))
      actions.push(
        createBtn('提交审核', { onClick: () => showSubmitReviewDialog(row, reload) })
      )
      break
    case 1:
      actions.push(
        createBtn('查看', { ghost: true, onClick: () => goDetail(row) })
      )
      actions.push(
        createBtn('撤回', { type: 'error', onClick: () => window.$message?.info('已撤回') })
      )
      break
    case 2:
      actions.push(createBtn('编辑', { ghost: true, onClick: () => goEdit(row) }))
      actions.push(
        createBtn('终止', { onClick: () => window.$message?.info('已终止') })
      )
      break
    case 3:
      actions.push(
        createBtn('暂停', {
          type: 'warning',
          ghost: true,
          onClick: () => window.$message?.info('已暂停'),
        })
      )
      actions.push(
        createBtn('开启投放', { onClick: () => window.$message?.info('已开启投放') })
      )
      break
    case 4:
      actions.push(createBtn('编辑', { ghost: true, onClick: () => goEdit(row) }))
      actions.push(
        createBtn('提交审核', { onClick: () => showSubmitReviewDialog(row, reload) })
      )
      break
  }

  if (row.rejectReason) {
    actions.push(
      createBtn('驳回原因', { type: 'warning', ghost: true, onClick: () => showRejectReasonDialog(row) })
    )
  }

  return h(NSpace, { size: 8, justify: 'end', wrap: false }, { default: () => actions })
}

export const getColumns = (reload) => {
  return [
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
    },
    {
      title: '投放周期',
      key: 'deliveryPeriod',
      width: 220,
      align: 'left',
      render(row) {
        return `${row.startDate}-${row.endDate}`
      },
    },
    {
      title: '投放预算',
      key: 'budget',
      width: 140,
      align: 'right',
      render(row) {
        return h(
          'span',
          { style: 'color: #f56c6c' },
          row.budget.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        )
      },
    },
    {
      title: '投放位置',
      key: 'position',
      width: 200,
      align: 'left',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 90,
      align: 'center',
      render(row) {
        const info = statusMap[row.status] || statusMap[0]
        return h(
          NTag,
          { type: info.type, size: 'small', round: true },
          { default: () => info.label }
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'right',
      render(row) {
        return renderActions(row, reload)
      },
    },
  ]
}

import { NButton, NTag, NSpace } from 'naive-ui'

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

function renderActions(row, reload) {
  const actions = []
  const status = row.status
  const msg = (text) => () => window.$message?.info(`${text}: ${row.id}`)

  switch (status) {
    case 0:
    case 5:
      actions.push(createBtn('编辑', { ghost: true, onClick: msg('编辑计划') }))
      actions.push(createBtn('提交审核', { onClick: msg('提交审核') }))
      break
    case 1:
      actions.push(createBtn('查看', { ghost: true, onClick: msg('查看计划') }))
      actions.push(createBtn('撤回', { type: 'error', onClick: msg('撤回') }))
      break
    case 2:
      actions.push(createBtn('编辑', { ghost: true, onClick: msg('编辑计划') }))
      actions.push(createBtn('终止', { onClick: msg('终止') }))
      break
    case 3:
      actions.push(createBtn('暂停', { type: 'warning', ghost: true, onClick: msg('暂停') }))
      actions.push(createBtn('开启投放', { onClick: msg('开启投放') }))
      break
    case 4:
      actions.push(createBtn('编辑', { ghost: true, onClick: msg('编辑计划') }))
      actions.push(createBtn('提交审核', { onClick: msg('提交审核') }))
      break
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
      align: 'left',
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

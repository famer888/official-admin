import { NButton, NTag, NSpace } from 'naive-ui'

const statusMap = {
  0: { label: '草稿', type: 'default' },
  1: { label: '审核中', type: 'warning' },
  2: { label: '已通过', type: 'info' },
  3: { label: '投放中', type: 'success' },
  4: { label: '已终止', type: 'error' },
  5: { label: '已撤回', type: 'default' },
}

function renderActions(row, reload) {
  const actions = []
  const status = row.status

  const createBtn = (text, type = 'primary', onClick) => {
    return h(
      NButton,
      { text: true, type, size: 'small', onClick },
      { default: () => text }
    )
  }

  if (status === 0 || status === 5) {
    actions.push(createBtn('编辑', 'primary', () => window.$message?.info(`编辑计划: ${row.id}`)))
    actions.push(
      createBtn('提交审核', 'primary', () => window.$message?.info(`提交审核: ${row.id}`))
    )
  } else if (status === 1) {
    actions.push(createBtn('查看', 'primary', () => window.$message?.info(`查看计划: ${row.id}`)))
    actions.push(createBtn('撤回', 'error', () => window.$message?.info(`撤回: ${row.id}`)))
  } else if (status === 2) {
    actions.push(createBtn('编辑', 'primary', () => window.$message?.info(`编辑计划: ${row.id}`)))
    actions.push(
      createBtn('开启投放', 'primary', () => window.$message?.info(`开启投放: ${row.id}`))
    )
    actions.push(
      createBtn('提交审核', 'primary', () => window.$message?.info(`提交审核: ${row.id}`))
    )
  } else if (status === 3) {
    actions.push(createBtn('查看', 'primary', () => window.$message?.info(`查看计划: ${row.id}`)))
  } else if (status === 4) {
    actions.push(createBtn('编辑', 'primary', () => window.$message?.info(`编辑计划: ${row.id}`)))
    actions.push(
      createBtn('提交审核', 'primary', () => window.$message?.info(`提交审核: ${row.id}`))
    )
  }

  return h(NSpace, { size: 8 }, { default: () => actions })
}

export const getColumns = (reload) => {
  return [
    {
      title: '计划',
      key: 'id',
      width: 180,
      align: 'center',
    },
    {
      title: '计划名称',
      key: 'planName',
      width: 180,
      align: 'center',
      showFilter: true,
      componentProps: {
        placeholder: '关键字模糊查询',
      },
    },
    {
      title: '投放期间',
      key: 'deliveryPeriod',
      width: 220,
      align: 'center',
      render(row) {
        return `${row.startDate}-${row.endDate}`
      },
    },
    {
      title: '投放预算',
      key: 'budget',
      width: 150,
      align: 'center',
      render(row) {
        return h(
          'span',
          { class: row.status === 3 ? 'text-[#f56c6c]' : '' },
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
      width: 220,
      align: 'center',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      align: 'center',
      render(row) {
        const info = statusMap[row.status] || statusMap[0]
        return h(
          NTag,
          {
            type: info.type,
            size: 'small',
            round: true,
          },
          { default: () => info.label }
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render(row) {
        return renderActions(row, reload)
      },
    },
  ]
}

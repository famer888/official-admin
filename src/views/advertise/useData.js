import { h } from 'vue'
import { NButton, NTag, NSpace } from 'naive-ui'
import router from '@/router'

const statusMap = {
  0: { label: '草稿', color: '#999999' },
  1: { label: '审核中', color: '#4271BD' },
  2: { label: '审核不通过', color: '#C42527' },
  3: { label: '投放中', color: '#57AC22' },
  4: { label: '投放结束', color: '#626262' },
  5: { label: '投放未开始', color: '#A95656' },
}

const typeColorMap = {
  primary: '#3A82F9',
  success: '#1BAD64',
  error: '#FF292D',
  warning: '#F9A33A',
  tertiary: '#999999',
  info: '#4A36FF',
}

function createBtn(text, { type = 'primary', ghost = true, onClick }) {
  const color = typeColorMap[type]
  const style = {
    '--ad-btn-color': color,
  }
  return h(
    NButton,
    {
      // type,
      ghost,
      ...(color && { color }),
      size: 'small',
      onClick,
      class: 'ad-action-btn !rounded-[4px] text-base',
      style
    },
    { default: () => text }
  )
}

function showSubmitReviewDialog(row, reload) {
  window.$dialog?.create({
    title: false,
    showIcon: false,
    closable: false,
    style: { width: '340px', height: '226px', padding: '20px', borderRadius: '16px' },
    title: () =>
      h(
        'div',
        { class: 'text-center text-[20px] font-bold text-[#000000] w-full' },
        '是否提交审核？'
      ),
    titleStyle: { paddingTop: '35px' },
    actionStyle: {
      gap: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      right: '20px',
    },
    action: () =>
      h('div', { class: 'flex justify-center gap-5 w-full' }, [
        h(
          NButton,
          {
            ghost: true,
            type: 'primary',
            class: 'flex-1 !h-[42px] !text-base rounded-[4px] ',
            onClick: () => window.$dialog?.destroyAll(),
            style: {
              borderColor: '#3A82F9',
              color: '#3A82F9',
              fontWeight: 500,
            },
          },
          { default: () => '取消' }
        ),
        h(
          NButton,
          {
            type: 'primary',
            class: 'flex-1 !h-[42px] !text-base rounded-[4px]',
            style: {
              backgroundColor: '#3A82F9',
              color: '#ffffff',
              fontWeight: 500,
            },
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
    style: { width: '340px', height: '226px', padding: '20px 18px', borderRadius: '16px' },
    title: () =>
      h(
        'div',
        { class: 'text-center text-[20px] font-bold text-[#000000] w-full' },
        '审核驳回原因'
      ),
    titleStyle: { paddingTop: '20px' },
    content: () =>
      h(
        'div',
        {
          class: 'px-0 pt-2 pb-5  text-center whitespace-pre-line',
          style: {
            color: '#1D2129',
            fontSize: '16px',
            lineHeight: '26px',
          },
        },
        reason
      ),
    action: () =>
      h('div', { class: 'flex justify-center w-full pt-3 pb-5' }, [
        h(
          NButton,
          {
            ghost: true,
            type: 'primary',
            class: ' !h-[42px] !text-base rounded-[4px]',
            style: {
              borderColor: '#3276FF',
              color: '#3276FF',
              fontWeight: 500,
              width: '196px',
            },
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

      actions.push(createBtn('提交审核', {type:'primary', onClick: () => showSubmitReviewDialog(row, reload) }))
      break
    case 1:
      actions.push(createBtn('查看', { type: 'info', onClick: () => goDetail(row) }))
      actions.push(
        createBtn('撤回', { type: 'error', onClick: () => window.$message?.info('已撤回') })
      )
      break
    case 2:
      actions.push(createBtn('编辑', { type: 'success', onClick: () => goEdit(row) }))
      actions.push(
        createBtn('终止', { type: 'tertiary', onClick: () => window.$message?.info('已终止') })
      )
      break
    case 3:
      actions.push(
        createBtn('暂停', {
          type: 'tertiary',
          onClick: () => window.$message?.info('已暂停'),
        })
      )
      actions.push(
        createBtn('开启投放', {
          type: 'warning',
          onClick: () => window.$message?.info('已开启投放'),
        })
      )
      break
    case 4:
      actions.push(createBtn('编辑', { type: 'success', onClick: () => goEdit(row) }))

      actions.push(createBtn('提交审核', { onClick: () => showSubmitReviewDialog(row, reload) }))
      break
  }

  if (row.rejectReason) {
    actions.push(
      createBtn('驳回原因', {
        type: 'warning',
        ghost: true,
        onClick: () => showRejectReasonDialog(row),
      })
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
      render(row) {
        return h(
          'span',
          {
            style: 'font-weight: 600;font-size: 16px;line-height: 16px;color: #4C4F57;',
          },
          row.planName
        )
      },
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
          {
            style:
              "font-family: 'DIN Alternate','PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;font-weight: 700;font-size: 16px;line-height: 16px;color: #FF292D;",
          },
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
      render(row) {
        return h(
          'div',
          {
            style:
              'line-height: 20px; line-clamp: 2; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-all; display: -webkit-box;',
          },
          row.position
        )
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      align: 'center',
      render(row) {
        const info = statusMap[row.status] || statusMap[0]
        const color = info.color || '#999999'
        return h(
          'span',
          {
            style: {
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '96px',
              minWidth: '96px',
              height: '32px',
              borderRadius: '4px',
              border: `1px solid ${color}`,
              color,
              fontSize: '16px',
              fontWeight: 400,
            },
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
      render(row) {
        return renderActions(row, reload)
      },
    },
  ]
}

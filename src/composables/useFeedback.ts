import { useDialog } from 'naive-ui'
import ProForm from '@/components/ProForm/index.vue'

export default function useFeedback() {
  const dialog = useDialog()
  const showModal = ({ content, ...rest }) => {
    return dialog.create({
      title: '新增',
      showIcon: false,
      closeOnEsc: false,
      maskClosable: false,
      trapFocus: false,
      style: { width: '460px' },
      content: () => content(ProForm),
      ...rest,
    })
  }

  const confirmAction = ({ api, params, reload, type = 'create', ...rest }) => {
    const d = dialog[type]({
      title: '提示',
      closeOnEsc: false,
      maskClosable: false,
      content: '确定要删除当前数据吗?',
      positiveText: '确定',
      negativeText: '取消',
      trapFocus: false,
      class: 'deleteModal',
      negativeButtonProps: { type },
      onPositiveClick: async () => {
        d.loading = true
        try {
          const res = await api(params)
          if (res?.code === 0) {
            reload()
            if(res.data){
              $message.warning(res.data)
            }else{
              $message.success('操作成功')
            }
          }
        } catch (error) {
          console.error(error)
        } finally {
          d.loading = false
        }
      },
      ...rest,
    })
  }

  return { showModal, confirmAction }
}

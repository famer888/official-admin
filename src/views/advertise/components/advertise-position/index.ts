import { h } from 'vue'
import useFeedback from '@/composables/useFeedback'
import PositionPickerModal from './components/PositionPickerModal.vue'
import type { SelectedPlacementItem } from './hooks/types'

// 弹框对外可配置项
interface OpenPositionPickerOptions {
  title?: string
  // 每次选择变化实时回调
  onChange?: (list: SelectedPlacementItem[]) => void
  // 点击保存时回调
  onSave?: (list: SelectedPlacementItem[]) => void
  // 弹框打开时回显已选数据
  initialSelected?: SelectedPlacementItem[]
}

// 选择投放位置弹框入口
export function useAdvertisePositionModal() {
  const { showModal } = useFeedback()

  const openAdvertisePositionModal = (options?: OpenPositionPickerOptions) => {
    let d: any
    const titleText = options?.title || '选择投放位置'
    d = showModal({
      closable: false, // 关闭默认右上角 X，使用自定义头部按钮
      class: 'p-0',
      // 不使用 naive dialog header（外层样式不可控且不允许写自定义样式）
      title: null,
      style: { width: '1569px' }, 
      content: () =>
        h('div', { class: 'w-full p-5 pt-0 mt-0 flex flex-col gap-5' }, [
          // 自定义头部（纯 tailwind），避免受 n-dialog__header / __title 外层布局影响
          h(
            'div',
            {
              class:
                'bg-[#E8EDF8] -mx-5 px-6 py-5 rounded-t-xl flex items-center justify-center relative text-base font-semibold text-[#1D2129]',
            },
            [
              h('div', { class: 'px-10 text-center w-full' }, titleText),
              h(
                'button',
                {
                  type: 'button',
                  'aria-label': '关闭',
                  class:
                    'absolute right-4 top-1/2 -translate-y-1/2 text-[#1D2129]/60 hover:text-[#1D2129] leading-none text-[18px]',
                  onClick: () => d?.destroy(),
                },
                '×'
              ),
            ]
          ),
          h(PositionPickerModal, {
            onChange: (list: SelectedPlacementItem[]) => {
              options?.onChange?.(list)
            },
            onSave: (list: SelectedPlacementItem[]) => {
              options?.onSave?.(list)
              d?.destroy()
            },
            initialSelected: options?.initialSelected || [],
            onCancel: () => d?.destroy(),
          }),
        ]),
    })
    return d
  }

  return {
    openAdvertisePositionModal,
  }
}

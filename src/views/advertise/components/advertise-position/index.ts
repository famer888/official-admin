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
    d = showModal({
      title: options?.title || '选择投放位置',
      style: { width: '94vw', maxWidth: '1700px' },
      content: () =>
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
    })
    return d
  }

  return {
    openAdvertisePositionModal,
  }
}

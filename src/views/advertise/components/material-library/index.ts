/**
 * 素材库弹窗 composable
 * 用法与 useAdvertisePositionModal 一致：
 *   const { openMaterialLibraryModal } = useMaterialLibraryModal()
 *   openMaterialLibraryModal({ ratio: '4:3', onSelect: (item) => { ... } })
 */
import { h } from 'vue'
import useFeedback from '@/composables/useFeedback'
import MaterialLibraryModal from './components/MaterialLibraryModal.vue'

interface MaterialItem {
  id: number
  name: string
  type: string
  previewUrl: string
  size: string
}

interface OpenMaterialLibraryOptions {
  /** 图片比例要求（展示用），如 "4:3" */
  ratio?: string
  /** 选中素材后回调 */
  onSelect?: (item: MaterialItem) => void
}

export function useMaterialLibraryModal() {
  const { showModal } = useFeedback()

  const openMaterialLibraryModal = (options?: OpenMaterialLibraryOptions) => {
    let d: any
    d = showModal({
      title: '',
      closable: true,
      style: { width: '1020px', padding: '0' },
      class: 'overflow-hidden rounded-xl',
      onClose: () => d?.destroy(),
      content: () =>
        h(MaterialLibraryModal, {
          ratio: options?.ratio || '',
          onSelect: (item: MaterialItem) => {
            options?.onSelect?.(item)
            d?.destroy()
          },
          onCancel: () => d?.destroy(),
        }),
    })
    return d
  }

  return { openMaterialLibraryModal }
}

import { h } from 'vue'
import useFeedback from '@/composables/useFeedback'
import PositionPreviewContent from '../components/PositionPreviewContent.vue'

interface OpenPositionPreviewOptions {
  estimatedPv?: number
  previewImage?: string
}

// 广告位示意图弹窗（options 形式）
export function usePositionPreviewModal() {
  const { showModal } = useFeedback()

  const openPositionPreviewModal = (options?: OpenPositionPreviewOptions) => {
    let d: any
    d = showModal({
      title: '',
      style: { width: '860px' },
      content: () =>
        h(PositionPreviewContent, {
          estimatedPv: options?.estimatedPv,
          previewImage: options?.previewImage,
          onClose: () => d?.destroy(),
        }),
    })
    return d
  }

  return {
    openPositionPreviewModal,
  }
}

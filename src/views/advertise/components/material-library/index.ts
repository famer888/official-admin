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
      closable: false, // 关闭默认右上角 X，使用自定义头部
      class: 'p-0 overflow-hidden rounded-xl',
      title: null,
      style: { width: '1020px' },
      onClose: () => d?.destroy(),
      content: () =>
        h('div', { class: 'w-full flex flex-col' }, [
          // 自定义头部：标题「素材库」+ 右上角关闭按钮
          h(
            'div',
            {
              class:
                'bg-[#E8EDF8] px-6 py-5 rounded-t-xl flex items-center justify-center relative text-base font-semibold text-[#1D2129]',
            },
            [
              h('div', { class: 'px-10 text-center w-full' }, '素材库'),
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
          h(MaterialLibraryModal, {
            ratio: options?.ratio || '',
            onSelect: (item: MaterialItem) => {
              options?.onSelect?.(item)
              d?.destroy()
            },
            onCancel: () => d?.destroy(),
          }),
        ]),
    })
    return d
  }

  return { openMaterialLibraryModal }
}

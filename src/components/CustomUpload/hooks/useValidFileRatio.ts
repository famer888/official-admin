import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

type ValidFileRatioProps = {
  /** 比例, 例如: 1:1 */
  radio: string
  /** 校验失败时的提示函数 */
  message: MessageApiInjection
  /** 上传的文件 */
  file: File
  /** 允许误差比例, 默认 0.1 */
  diffRatio?: number
}

export const useValidFileRatio = ({
  radio,
  message,
  file,
  diffRatio = 0.1,
}: ValidFileRatioProps) => {
  return new Promise((resolve, reject) => {
    if ((radio === null && !radio) || !radio.includes(':')) {
      message.error('广告位比例配置错误')
      return reject(false)
    }
    const [rw, rh] = radio.split(':').map(Number)
    if (!rw || !rh) {
      message.error('广告位比例配置错误')
      return reject(false)
    }

    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const { width, height } = img
      URL.revokeObjectURL(img.src)

      const [rw, rh] = radio.split(':').map(Number)
      const expectedRatio = rw / rh
      const actualRatio = width / height

      // 允许误差 10%
      const diff = Math.abs(actualRatio - expectedRatio)
      if (diff > expectedRatio * diffRatio) {
        message.error(`该图片尺寸比例与广告位不符合，请重新上传，期望宽高比是${radio}`)
        reject(false)
      } else {
        resolve(true)
      }
    }

    img.onerror = () => {
      message.error('无法读取图片信息')
      reject(false)
    }
  })
}

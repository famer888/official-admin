import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

type ValidFileSizeProps = {
  /** 上传的文件 */
  file: File
  /** 文件大小，单位 MB */
  fileSize: number
  /** 提示信息对象 */
  message: MessageApiInjection
}

export const useValidFileSize = ({ file, fileSize, message }: ValidFileSizeProps) => {
  const originFileSize = file.size // 源文件
  const MAX_SIZE = fileSize * 1024 * 1024 // 期望文件大小，单位 byte

  if (originFileSize > MAX_SIZE) {
    message.error(`上传文件大小不能超过 ${fileSize}M`)
    return false
  }

  return true
}

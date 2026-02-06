type FileData = {
  id: string
  name: string
  status: string
  url: string
}

type SetFileListProps = {
  /** 文件列表 */
  fileList: Ref<FileData[]>
  /** 上传的文件 */
  val: string | string[]
  /** 上传的文件基础路径 */
  base: string
  /** 是否是多文件上传 */
  isMulti: boolean
}

export const useSetFileList = ({ fileList, val, base, isMulti }: SetFileListProps) => {
  if (val === null || val === undefined || val === '' || !val?.length) {
    return
  }
  const now = Date.now()

  if (fileList.value.length) {
    return
  }

  if (isMulti) {
    fileList.value = (val as string[]).map((rel, i) => ({
      id: `${now}_${i}`,
      name: String(rel).split('/').pop() as string,
      status: 'finished',
      url: base + rel,
    }))
  } else {
    fileList.value = [
      {
        id: `${now}_${val}`,
        name: String(val).split('/').pop() as string,
        status: 'finished',
        url: base + val,
      },
    ]
  }
}

import axios from 'axios'
import { ApiClient } from './client'

export type ContentCreateParams = {
  name: string
  quality: string
  description?: string
  privacy: string
  fromTime?: string
  toTime?: string
}

export const maxUploadFileSize = 4 * 1024 * 1024 * 1024
export const maxUploadFileSizeLabel = '4GB'

export class UploadFileSizeTooLargeException extends Error {
  constructor() {
    super(`アップロードできるファイルサイズは${maxUploadFileSizeLabel}までです`)
  }
}

export async function createContent(
  client: ApiClient,
  params: ContentCreateParams,
  contentFile: File | Buffer,
  onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
) {
  if (contentFile instanceof File && contentFile.size > maxUploadFileSize) {
    throw new UploadFileSizeTooLargeException()
  }
  const result = await client.post<any>('/contents', { ...params, encryption: false })
  const uploadUrl = result.data.signedUrl
  await axios.put(uploadUrl, contentFile, {
    onUploadProgress(event) {
      onUploadProgress({ loaded: event.loaded, total: event.total })
    },
  })
  return result
}

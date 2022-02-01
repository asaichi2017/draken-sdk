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

export async function createContent(
  client: ApiClient,
  params: ContentCreateParams,
  contentFile: File | Buffer,
  onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
) {
  const result = await client.post<any>('/contents', { ...params, encryption: false })
  const uploadUrl = result.data.signedUrl
  await axios.put(uploadUrl, contentFile, {
    onUploadProgress(event) {
      onUploadProgress({ loaded: event.loaded, total: event.total })
    },
  })
  return result
}

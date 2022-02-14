import axios from 'axios'
import { ApiClient } from './client'

type ContentQuality = 'low' | 'default' | 'medium' | 'high' | 'highest'
type ContentPrivacy = 'public' | 'private' | 'restricted'

// enum ContentPrivacy {
//   PUBLIC = 'public',
//   PRIVATE = 'private',
//   RESTRICTED = 'restricted',
// }
//
// enum ContentQuality {
//   LOW = 'low',
//   DEFAULT = 'default',
//   MEDIUM = 'medium',
//   HIGH = 'high',
//   HIGHEST = 'highest',
// }

export type ContentCreateParams = {
  name: string
  quality: ContentQuality
  description?: string
  privacy: ContentPrivacy
  fromTime?: string
  toTime?: string
}

type SignedUrlInfo = { url: string; PartNumber: number }

type CreateMultipartUploadResponse = {
  uploadId: string | undefined
  urls: SignedUrlInfo[]
  chunkSize: number
}
type ETagMapping = { ETag: string; PartNumber: number }[]

export const maxUploadFileSize = 32 * 1024 * 1024 * 1024
export const maxUploadFileSizeLabel = '32GB'

export class UploadFileSizeTooLargeException extends Error {
  constructor() {
    super(`アップロードできるファイルサイズは${maxUploadFileSizeLabel}までです`)
  }
}

export async function createContent(
  client: ApiClient,
  params: ContentCreateParams,
  contentFile: File,
  onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
) {
  const result = await client.post<any>('/contents', { ...params, encryption: false })
  const contentId = result.data.id
  const { uploadId, urls, chunkSize } = await client.post<CreateMultipartUploadResponse>(
    `/contents/${contentId}/createMultipartUpload`,
    { fileSize: contentFile.size },
  )
  if (uploadId) {
    const eTagMapping = await uploadMultipart(contentFile, urls, chunkSize, onUploadProgress)
    await client.post(`/contents/${contentId}/completeMultipartUpload`, {
      uploadId,
      eTagMapping,
    })
  } else {
    const uploadUrl = urls[0].url
    await axios.put(uploadUrl, contentFile, {
      onUploadProgress(event) {
        onUploadProgress({ loaded: event.loaded, total: event.total })
      },
    })
  }
  return result
}

async function uploadMultipart(
  file: File,
  urls: SignedUrlInfo[],
  chunkSize: number,
  onUploadProgress: (progress: { loaded: number; total: number }) => void,
): Promise<ETagMapping> {
  let uploadedSize = 0
  onUploadProgress({ loaded: 0, total: file.size })
  return Promise.all(
    urls.map(async ({ url, PartNumber }, i) => {
      const startSize = i * chunkSize
      const endSize = Math.min((i + 1) * chunkSize, file.size)
      const filePart = file.slice(startSize, endSize)
      const result = await axios.put(url, filePart)
      uploadedSize += endSize - startSize
      onUploadProgress({ loaded: uploadedSize, total: file.size })
      const eTag = result.headers['etag']
      return { ETag: eTag, PartNumber }
    }),
  )
}

export type UpdateCreateParams = {
  name: string
  description?: string
  privacy: string
  fromTime?: string | null
  toTime?: string | null
}

export async function update(client: ApiClient, id: string, params: UpdateCreateParams) {
  return await client.patch<any>(`/contents/${id}`, params)
}

export async function get(client: ApiClient, id: string) {
  return await client.get<any>(`/contents/${id}`)
}

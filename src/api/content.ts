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
type ETagInfo = { ETag: string; PartNumber: number }
type ETagMapping = ETagInfo[]

export type ProgressInfo = {
  eTagMapping: ETagMapping
  urls: SignedUrlInfo[]
  contentId: string
  uploadId: string
  chunkSize: number
}

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
  onProgress: (progressInfo: ProgressInfo) => void = () => {},
) {
  const result = await client.post<any>('/contents', { ...params, encryption: false })
  const contentId = result.data.id
  const { uploadId, urls, chunkSize } = await client.post<CreateMultipartUploadResponse>(
    `/contents/${contentId}/createMultipartUpload`,
    { fileSize: contentFile.size },
  )
  if (uploadId) {
    const eTagMapping = await uploadMultipart(
      contentFile,
      { eTagMapping: [], urls, contentId, uploadId, chunkSize },
      onUploadProgress,
      onProgress,
    )

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

export async function resumeUpload(
  client: ApiClient,
  contentFile: File,
  progressInfo: ProgressInfo,
  onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
  onProgress: (progressInfo: ProgressInfo) => void = () => {},
) {
  const eTagMapping = await uploadMultipart(contentFile, progressInfo, onUploadProgress, onProgress)
  const contentId = progressInfo.contentId
  const uploadId = progressInfo.uploadId
  await client.post(`/contents/${contentId}/completeMultipartUpload`, {
    uploadId,
    eTagMapping,
  })
}

async function uploadMultipart(
  file: File,
  progressInfo: ProgressInfo,
  onUploadProgress: (progress: { loaded: number; total: number }) => void,
  onProgress: (progressInfo: ProgressInfo) => void,
): Promise<ETagMapping> {
  const chunkSize = progressInfo.chunkSize
  let uploadedSize = progressInfo.eTagMapping.length * chunkSize
  if (progressInfo.eTagMapping.find(a => a.PartNumber === Math.ceil(file.size / chunkSize))) {
    // 一番最後のチャンクはchunkSizeより小さいので補正してあげる
    uploadedSize += (file.size % chunkSize) - chunkSize
  }
  onUploadProgress({ loaded: uploadedSize, total: file.size })
  onProgress(progressInfo)
  const urls = [...progressInfo.urls]
  await Promise.all(
    urls.map(async ({ url, PartNumber }) => {
      const startSize = (PartNumber - 1) * chunkSize
      const endSize = Math.min(PartNumber * chunkSize, file.size)
      const filePart = file.slice(startSize, endSize)
      const result = await axios.put(url, filePart)
      const ETag = result.headers['etag']
      uploadedSize += endSize - startSize
      onUploadProgress({ loaded: uploadedSize, total: file.size })
      progressInfo.urls.splice(
        progressInfo.urls.findIndex(a => a.PartNumber === PartNumber),
        1,
      )
      progressInfo.eTagMapping.push({ ETag, PartNumber })
      onProgress(progressInfo)
    }),
  )
  return progressInfo.eTagMapping
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

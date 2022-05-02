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

export type MultiPartUploadProgressInfo = {
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

async function uploadFile(
  client: ApiClient,
  contentId: string,
  contentFile: File,
  onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
  onMultiPartUploadProgress: (progressInfo: MultiPartUploadProgressInfo) => void = () => {},
) {
  const { uploadId, urls, chunkSize } = await client.post<CreateMultipartUploadResponse>(
    `/contents/${contentId}/createMultipartUpload`,
    { fileSize: contentFile.size },
  )
  if (uploadId) {
    const eTagMapping = await uploadMultipart(
      contentFile,
      { eTagMapping: [], urls, contentId, uploadId, chunkSize },
      onUploadProgress,
      onMultiPartUploadProgress,
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
}

export async function createContent(
  client: ApiClient,
  params: ContentCreateParams,
  contentFile: File,
  onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
  onMultiPartUploadProgress: (progressInfo: MultiPartUploadProgressInfo) => void = () => {},
) {
  const result = await client.post<any>('/contents', { ...params, encryption: false })
  const contentId = result.data.id
  await uploadFile(client, contentId, contentFile, onUploadProgress, onMultiPartUploadProgress)
  return result
}

export type ContentReUploadParams = {
  quality: string
  originalFileName?: string
}
export async function reUploadContent(
  client: ApiClient,
  contentId: string,
  params: ContentReUploadParams,
  contentFile: File,
  onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
  onMultiPartUploadProgress: (progressInfo: MultiPartUploadProgressInfo) => void = () => {},
) {
  const result = await client.post(`/contents/${contentId}/reUpload`, params)
  await uploadFile(client, contentId, contentFile, onUploadProgress, onMultiPartUploadProgress)
  return result
}

export async function resumeUpload(
  client: ApiClient,
  contentFile: File,
  progressInfo: MultiPartUploadProgressInfo,
  onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
  onMultiPartUploadProgress: (progressInfo: MultiPartUploadProgressInfo) => void = () => {},
) {
  const eTagMapping = await uploadMultipart(contentFile, progressInfo, onUploadProgress, onMultiPartUploadProgress)
  const contentId = progressInfo.contentId
  const uploadId = progressInfo.uploadId
  await client.post(`/contents/${contentId}/completeMultipartUpload`, {
    uploadId,
    eTagMapping,
  })
}

async function uploadMultipart(
  file: File,
  progressInfo: MultiPartUploadProgressInfo,
  onUploadProgress: (progress: { loaded: number; total: number }) => void,
  onMultiPartUploadProgress: (progressInfo: MultiPartUploadProgressInfo) => void,
): Promise<ETagMapping> {
  const chunkSize = progressInfo.chunkSize
  let uploadedSize = progressInfo.eTagMapping.length * chunkSize
  if (progressInfo.eTagMapping.find(a => a.PartNumber === Math.ceil(file.size / chunkSize))) {
    // 一番最後のチャンクはchunkSizeより小さいので補正してあげる
    uploadedSize += (file.size % chunkSize) - chunkSize
  }
  onUploadProgress({ loaded: uploadedSize, total: file.size })
  onMultiPartUploadProgress(progressInfo)
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
      onMultiPartUploadProgress(progressInfo)
    }),
  )
  return progressInfo.eTagMapping
}

export type ContentUpdateParams = {
  name?: string
  description?: string
  privacy?: string
  fromTime?: string | null
  toTime?: string | null
  posterFile?: string
}

export async function update(client: ApiClient, id: string, params: ContentUpdateParams) {
  return await client.patch<any>(`/contents/${id}`, params)
}

export async function get(client: ApiClient, id: string) {
  return await client.get<any>(`/contents/${id}`)
}

export async function deleteContent(client: ApiClient, id: string) {
  return await client.delete(`/contents/${id}`)
}

import drakenPlayer from 'draken-player'
import 'draken-player/dist/draken-player.css'
import type { PlayerInterface, RequestOptions, PlayOptions } from 'draken-player'
import { ApiClient } from './api/client'
import type {
  ContentCreateParams,
  ContentReUploadParams,
  ContentUpdateParams,
  MultiPartUploadProgressInfo,
} from './api/content'
import {
  createContent,
  reUploadContent,
  resumeUpload,
  update as updateContent,
  get as getContent,
  deleteContent,
  downloadVideo,
  uploadThumbnail,
} from './api/content'
export { maxUploadFileSize, maxUploadFileSizeLabel, UploadFileSizeTooLargeException } from './api/content'
export type { MultiPartUploadProgressInfo } from './api/content'

class Sdk {
  protected config?: RequestOptions

  configure(config: RequestOptions) {
    this.config = config
  }

  player(dom: string | HTMLVideoElement, options: PlayOptions = {}): PlayerInterface {
    this.checkConfigured()
    return drakenPlayer.player(dom, { ...options, ...this.config! })
  }

  async create(
    params: ContentCreateParams,
    contentFile: File,
    onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
    onMultiPartUploadProgress: (progressInfo: MultiPartUploadProgressInfo) => void = () => {},
  ) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return await createContent(apiClient, params, contentFile, onUploadProgress, onMultiPartUploadProgress)
  }

  async reUpload(
    contentId: string,
    params: ContentReUploadParams,
    contentFile: File,
    onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
    onMultiPartUploadProgress: (progressInfo: MultiPartUploadProgressInfo) => void = () => {},
  ) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return await reUploadContent(apiClient, contentId, params, contentFile, onUploadProgress, onMultiPartUploadProgress)
  }

  async resumeUpload(
    contentFile: File,
    progressInfo: MultiPartUploadProgressInfo,
    onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
    onMultiPartUploadProgress: (progressInfo: MultiPartUploadProgressInfo) => void = () => {},
  ) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return await resumeUpload(apiClient, contentFile, progressInfo, onUploadProgress, onMultiPartUploadProgress)
  }

  async update(id: string, params: ContentUpdateParams) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return updateContent(apiClient, id, params)
  }

  async get(id: string) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return getContent(apiClient, id)
  }

  async delete(id: string) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return deleteContent(apiClient, id)
  }

  async downloadVideo(id: string): Promise<URL> {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return downloadVideo(apiClient, id)
  }

  async uploadThumbnail(id: string, file: File) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return uploadThumbnail(apiClient, id, file)
  }

  protected checkConfigured() {
    if (!this.config?.endpoint) {
      throw new Error('endpointを指定してください')
    }
  }
}

const sdk = new Sdk()
export default sdk

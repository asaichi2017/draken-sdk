import drakenPlayer from 'draken-player'
import 'draken-player/dist/draken-player.css'
import type { PlayerInterface, RequestOptions, PlayOptions } from 'draken-player'
import { ApiClient } from './api/client'
import type { ContentCreateParams, UpdateCreateParams, ProgressInfo } from './api/content'
import { createContent, resumeUpload, update as updateContent, get as getContent } from './api/content'
export { maxUploadFileSize, maxUploadFileSizeLabel, UploadFileSizeTooLargeException } from './api/content'
export type { ProgressInfo } from './api/content'

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
    onProgress: (progressInfo: ProgressInfo) => void = () => {},
  ) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return await createContent(apiClient, params, contentFile, onUploadProgress, onProgress)
  }

  async resumeUpload(
    contentFile: File,
    progressInfo: ProgressInfo,
    onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
    onProgress: (progressInfo: ProgressInfo) => void = () => {},
  ) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return await resumeUpload(apiClient, contentFile, progressInfo, onUploadProgress, onProgress)
  }

  async update(id: string, params: UpdateCreateParams) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return updateContent(apiClient, id, params)
  }

  async get(id: string) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return getContent(apiClient, id)
  }

  protected checkConfigured() {
    if (!this.config?.endpoint) {
      throw new Error('endpointを指定してください')
    }
  }
}

const sdk = new Sdk()
export default sdk

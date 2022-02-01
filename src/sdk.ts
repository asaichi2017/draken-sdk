import drakenPlayer from 'draken-player'
import 'draken-player/dist/draken-player.css'
import type { PlayerInterface, RequestOptions, PlayOptions } from 'draken-player'
import { ApiClient } from './api/client'
import { ContentCreateParams } from './api/content'
import { createContent } from './api/content'
export { maxUploadFileSize, maxUploadFileSizeLabel, UploadFileSizeTooLargeException } from './api/content'

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
    contentFile: File | Buffer,
    onUploadProgress: (progress: { loaded: number; total: number }) => void = () => {},
  ) {
    this.checkConfigured()
    const apiClient = new ApiClient(this.config!)
    return await createContent(apiClient, params, contentFile, onUploadProgress)
  }

  protected checkConfigured() {
    if (!this.config?.endpoint) {
      throw new Error('endpointを指定してください')
    }
  }
}

const sdk = new Sdk()
export default sdk

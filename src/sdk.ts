import axios from 'axios'
import drakenPlayer from 'player'
import 'player/dist/style.css'
import type { PlayerInterface, RequestOptions, PlayOptions } from 'player'
import { ApiClient } from './api/client'
import { ContentCreateParams } from './api/content'
import { createContent } from './api/content'

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
    const result = await createContent(apiClient, params)
    const uploadUrl = result.data.signedUrl
    await axios.put(uploadUrl, contentFile, {
      onUploadProgress(event) {
        onUploadProgress({ loaded: event.loaded, total: event.total })
      },
    })
    return result
  }

  protected checkConfigured() {
    if (!this.config?.endpoint) {
      throw new Error('endpointを指定してください')
    }
  }
}

const sdk = new Sdk()
export default sdk

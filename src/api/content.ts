import { ApiClient } from './client'

export type ContentCreateParams = {
  name: string
  quality: string
  description?: string
  privacy: string
  fromTime?: string
  toTime?: string
}

export async function createContent(client: ApiClient, params: ContentCreateParams) {
  return await client.post<any>('/contents', { ...params, encryption: false })
}

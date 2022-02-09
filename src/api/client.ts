import axios from 'axios'
import type { RequestOptions } from 'draken-player'

async function getHeader(config: RequestOptions) {
  const header = {
    'Content-Type': 'application/json',
    'x-admin-authorization': await Promise.resolve(config.adminToken?.()),
    Authorization: await Promise.resolve(config.idToken?.()).then(a => a && `Bearer ${a}`),
    'x-api-key': config.apiKey,
  }

  return Object.entries(header)
    .filter(([, value]) => value)
    .reduce((prev, [key, value]) => ({ ...prev, ...{ [key]: value } }), {} as any)
}
export class ApiClient {
  constructor(protected config: RequestOptions) {}

  async post<T>(path: string, params: Record<string, unknown>): Promise<T> {
    const response = await axios.post<T>(`${this.config.endpoint}/v1${path}`, params, {
      headers: await getHeader(this.config),
    })
    return response.data
  }

  async patch<T>(path: string, params: Record<string, unknown>): Promise<T> {
    const response = await axios.patch<T>(`${this.config.endpoint}/v1${path}`, params, {
      headers: await getHeader(this.config),
    })
    return response.data
  }
}

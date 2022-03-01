export const contentID = String(import.meta.env.VITE_CONTENT_ID ?? '')
const endpoint = import.meta.env.VITE_ENDPOINT
const apiKey = import.meta.env.VITE_API_KEY
const idToken = import.meta.env.VITE_ID_TOKEN
const adminToken = import.meta.env.VITE_ADMIN_TOKEN

export const config = {
  ...{ endpoint: String(endpoint) },
  ...(apiKey ? { apiKey: String(apiKey) } : {}),
  ...(idToken ? { idToken: () => String(idToken) } : {}),
  ...(adminToken ? { adminToken: () => String(adminToken) } : {}),
}

import draken from './sdk'

const endpoint = import.meta.env.VITE_ENDPOINT
const apiKey = import.meta.env.VITE_API_KEY
const idToken = import.meta.env.VITE_ID_TOKEN

draken.configure({
  ...{ endpoint: String(endpoint) },
  ...(apiKey ? { apiKey: String(apiKey) } : {}),
  ...(idToken ? { idToken: () => String(apiKey) } : {}),
})

const player = draken.player('video')
player.load(String(import.meta.env.VITE_CONTENT_ID))

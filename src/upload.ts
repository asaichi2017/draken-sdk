import draken from './sdk'

const endpoint = import.meta.env.VITE_ENDPOINT
const apiKey = import.meta.env.VITE_API_KEY
const idToken = import.meta.env.VITE_ID_TOKEN

draken.configure({
  ...{ endpoint: String(endpoint) },
  ...(apiKey ? { apiKey: String(apiKey) } : {}),
  ...(idToken ? { idToken: () => String(apiKey) } : {}),
})

const form = document.getElementById('form') as HTMLFormElement
form.addEventListener('submit', async e => {
  e.preventDefault()
  const name = form.name
  const file = form.file.files[0]
  await draken.create({ name, quality: 'default', privacy: 'private' }, file, p => {
    console.log(p)
  })
  alert('アップロード完了しました')
})

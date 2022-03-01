import draken from '../sdk'

const contentID = String(import.meta.env.VITE_CONTENT_ID ?? '')
const endpoint = import.meta.env.VITE_ENDPOINT
const apiKey = import.meta.env.VITE_API_KEY
const idToken = import.meta.env.VITE_ID_TOKEN
const adminToken = import.meta.env.VITE_ADMIN_TOKEN

draken.configure({
  ...{ endpoint: String(endpoint) },
  ...(apiKey ? { apiKey: String(apiKey) } : {}),
  ...(idToken ? { idToken: () => String(idToken) } : {}),
  ...(adminToken ? { adminToken: () => String(adminToken) } : {}),
})

const form = document.getElementById('form') as HTMLFormElement

form.contentID.value = contentID
async function init() {
  const response = await draken.get(contentID)
  const content = response.data
  form.contentName.value = content.name
  form.description.value = content.description ?? ''
  form.privacy.value = content.privacy
  form.fromTime.value = content.fromTime
  form.toTime.value = content.toTime
}
init()

form.addEventListener('submit', async e => {
  e.preventDefault()
  const contentID = form.contentID.value
  try {
    await draken.update(contentID, {
      name: form.contentName.value,
      description: form.description.value ? form.description.value : null,
      privacy: form.privacy.value,
      fromTime: form.fromTime.value ? new Date(form.fromTime.value).toISOString() : null,
      toTime: form.fromTime.value ? new Date(form.toTime.value).toISOString() : null,
    })
    alert('更新完了しました')
  } catch (e) {
    alert(e)
  }
})

import draken from '../sdk'
import { config, contentID } from './env'

draken.configure(config)

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

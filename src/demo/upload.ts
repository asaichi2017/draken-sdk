import draken from '../sdk'
import { config } from './env'

draken.configure(config)

const form = document.getElementById('form') as HTMLFormElement
form.addEventListener('submit', async e => {
  e.preventDefault()
  const file = form.file.files[0]
  await draken.create(
    { name: form.contentName.value, quality: 'default', privacy: 'private' },
    file,
    p => {
      console.info(p)
    },
    progressInfo => {
      console.info(progressInfo)
      localStorage.setItem(
        'upload',
        JSON.stringify({
          file: {
            name: file.name,
            size: file.size,
          },
          progressInfo,
        }),
      )
    },
  )
  localStorage.removeItem('upload')
  alert('アップロード完了しました')
})

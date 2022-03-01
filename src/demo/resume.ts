import draken from '../sdk'
import { config } from './env'

draken.configure(config)

const resumeInfo = JSON.parse(localStorage.getItem('upload') ?? 'null')

const form = document.getElementById('form') as HTMLFormElement

form.contentId.value = resumeInfo?.progressInfo.contentId ?? ''
form.fileName.value = resumeInfo?.file.name ?? ''
form.fileSize.value = resumeInfo?.file.size ?? ''

form.addEventListener('submit', async e => {
  e.preventDefault()
  const file = form.file.files[0]
  await draken.resumeUpload(
    file,
    resumeInfo.progressInfo,
    p => {
      console.info(p)
    },
    info => {
      console.info(info)
      localStorage.setItem(
        'upload',
        JSON.stringify({
          file: {
            name: file.name,
            size: file.size,
          },
          info,
        }),
      )
    },
  )
  localStorage.removeItem('upload')
  alert('アップロード完了しました')
})

import draken from './sdk'

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

const resumeInfo = JSON.parse(localStorage.getItem('upload') ?? 'null')

const form = document.getElementById('form') as HTMLFormElement

form.contentId.value = resumeInfo?.progressInfo.contentId
form.fileName.value = resumeInfo?.file.name
form.fileSize.value = resumeInfo?.file.size

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

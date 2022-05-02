import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import draken from 'draken-sdk'

type FormData = {
  contentId: string
}

const initialFormData: FormData = {
  contentId: '',
}

function DownloadVideo() {
  const auth0 = useAuth0()
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    draken.configure({
      endpoint: String(import.meta.env.VITE_DRAKEN_ENDPOINT),
      idToken: () => auth0.getIdTokenClaims().then(a => a?.__raw ?? ''),
    })
  }, [])

  const submit = useCallback(async (formData: FormData) => {
    try {
      const url = await draken.downloadVideo(formData.contentId)
      const data = await fetch(url.toString()).then(a => a.blob())
      const a = document.createElement('a')
      a.href = URL.createObjectURL(data)
      a.download = `${formData.contentId}.mp4`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error(error)
      alert('取得に失敗しました')
    }
  }, [])

  return (
    <div>
      <h1>Download Video</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          submit(formData)
        }}
      >
        <div>
          <label htmlFor="contentId">content ID</label>
          <input
            id="contentId"
            type="text"
            value={formData.contentId}
            onChange={e => setFormData(d => ({ ...d, ...{ contentId: e.target.value } }))}
          />
        </div>
        <div>
          <button>送信</button>
        </div>
      </form>
    </div>
  )
}

export default DownloadVideo

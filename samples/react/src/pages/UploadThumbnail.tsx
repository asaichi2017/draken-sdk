import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import draken from 'draken-sdk'

type FormData = {
  contentId: string
}

const initialFormData: FormData = {
  contentId: '',
}

function UploadThumbnail() {
  const auth0 = useAuth0()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    draken.configure({
      endpoint: String(import.meta.env.VITE_DRAKEN_ENDPOINT),
      idToken: () => auth0.getIdTokenClaims().then(a => a?.__raw ?? ''),
    })
  }, [])

  const submit = useCallback(async (formData: FormData, file: File | undefined) => {
    if (!file) {
      alert('ファイルを選択してください')
      return
    }
    try {
      const result = await draken.uploadThumbnail(formData.contentId, file)
      console.info(result)
      alert('アップロードが完了しました')
      setFormData(initialFormData)
      fileInputRef.current!.value = ''
    } catch (error) {
      console.error(error)
      alert('アップロードに失敗しました')
    }
  }, [])

  return (
    <div>
      <h1>Upload Thumbnail</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          submit(formData, fileInputRef.current?.files?.[0])
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
          <input type="file" accept="image/*" ref={fileInputRef} />
        </div>
        <div>
          <button>送信</button>
        </div>
      </form>
    </div>
  )
}

export default UploadThumbnail

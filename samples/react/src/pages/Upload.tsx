import {useCallback, useEffect, useRef, useState} from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import draken from 'draken-sdk'
import './Upload.css'

type FormData = {
  name: string
}

const initialFormData: FormData = {
  name: '',
}

function Upload() {
  const auth0 = useAuth0()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  // DOMのレンダリング後に一度だけ実行
  useEffect(() => {
    draken.configure({
      endpoint: String(import.meta.env.VITE_DRAKEN_ENDPOINT),
      idToken: () => auth0.getIdTokenClaims().then(a => a?.__raw ?? ''),
    })
  }, [])

  const upload = useCallback(async (formData: FormData, file: File | undefined) => {
    if (!file) {
      alert('ファイルを選択してください')
      return
    }
    setUploadProgress(0)
    try {
      // コンテンツを作成してアップロード
      const result = await draken.create(
        {
          name: formData.name,
          privacy: 'public',
          quality: 'high',
          description: 'アップロードテスト',
        },
        file,
        ({ loaded, total }) => {
          setUploadProgress(total === 0 ? 0 : loaded / total)
        },
      )
      console.info(result)
      alert('アップロードが完了しました')
      setFormData(initialFormData)
      fileInputRef.current!.value = ''
      setUploadProgress(null)
    } catch (error) {
      console.error(error)
      alert('アップロードに失敗しました')
    }
  }, [])

  return (
    <div>
      <h1>Upload</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          upload(formData, fileInputRef.current?.files?.[0])
        }}
      >
        <div className="Upload__formItem">
          <label htmlFor="name">name </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData(d => ({ ...d, ...{ name: e.target.value } }))}
          />
        </div>
        <div className="Upload__formItem">
          <input type="file" accept="video/*" ref={fileInputRef} />
        </div>
        <div className="Upload__formItem">
          <button>送信</button>
        </div>
        {uploadProgress !== null && (
          <div className="Upload__progress">
            <span>アップロード進捗</span>
            <span>{Math.round(uploadProgress * 100)}%</span>
          </div>
        )}
      </form>
    </div>
  )
}

export default Upload

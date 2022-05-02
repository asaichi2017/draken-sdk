import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import draken from 'draken-sdk'

type FormData = {
  contentId: string
  quality: string
}

const initialFormData: FormData = {
  contentId: '',
  quality: 'default',
}

function ReUpload() {
  const auth0 = useAuth0()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

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
      const result = await draken.reUpload(
        formData.contentId,
        {
          quality: formData.quality,
          originalFileName: file.name,
        },
        file,
        ({ loaded, total }) => {
          setUploadProgress(total === 0 ? 0 : loaded / total)
        },
        progressInfo => {
          localStorage.setItem(
            'uploadProgressInfo',
            JSON.stringify({
              fileInfo: {
                name: file.name,
                size: file.size,
              },
              progressInfo,
            }),
          )
        },
      )
      localStorage.removeItem('uploadProgressInfo')
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
      <h1>ReUpload</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          upload(formData, fileInputRef.current?.files?.[0])
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
          <input type="file" accept="video/*" ref={fileInputRef} />
        </div>
        <div>
          <label htmlFor="quality">画質設定</label>
          <select
            value={formData.quality}
            onChange={e => setFormData(d => ({ ...d, ...{ quality: e.target.value as any } }))}
          >
            <option value="high">高画質</option>
            <option value="default">標準画質</option>
          </select>
        </div>
        <div>
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

export default ReUpload

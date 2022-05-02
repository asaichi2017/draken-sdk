import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import draken from 'draken-sdk'

function ResumeUpload() {
  const auth0 = useAuth0()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  useEffect(() => {
    draken.configure({
      endpoint: String(import.meta.env.VITE_DRAKEN_ENDPOINT),
      idToken: () => auth0.getIdTokenClaims().then(a => a?.__raw ?? ''),
    })
  }, [])

  const { fileInfo, progressInfo } = JSON.parse(localStorage.getItem('uploadProgressInfo') ?? '{}')

  const upload = useCallback(async (file: File | undefined) => {
    if (!file) {
      alert('ファイルを選択してください')
      return
    }
    setUploadProgress(0)

    try {
      const result = await draken.resumeUpload(
        file,
        progressInfo,
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
      fileInputRef.current!.value = ''
      setUploadProgress(null)
    } catch (error) {
      console.error(error)
      alert('アップロードに失敗しました')
    }
  }, [])

  return (
    <div>
      <h1>Resume Upload</h1>
      {fileInfo ? (
        <>
          <p>
            アップロードが中断された時と同じファイルを選択してください
            <table>
              <tr>
                <th>ファイル名</th>
                <td>{fileInfo.name}</td>
              </tr>
              <tr>
                <th>ファイルサイズ</th>
                <td>{fileInfo.size}</td>
              </tr>
            </table>
          </p>

          <form
            onSubmit={e => {
              e.preventDefault()
              upload(fileInputRef.current?.files?.[0])
            }}
          >
            <div>
              <input type="file" accept="video/*" ref={fileInputRef} />
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
        </>
      ) : (
        <>
          <p>中断されたアップロードがありません</p>
          <p>
            UploadかReUpload画面でサイズの大きなファイルを選択してアップロードを実行し、途中でリロードするなどしてアップロードを中断してください
          </p>
        </>
      )}
    </div>
  )
}

export default ResumeUpload

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import draken from 'draken-sdk'

type FormData = {
  contentId: string
  name: string
  description: string
  privacy: 'public' | 'private' | 'restricted'
  fromTime: string
  toTime: string
}

const initialFormData: FormData = {
  contentId: '',
  name: '',
  description: '',
  privacy: 'public',
  fromTime: '',
  toTime: '',
}

function Update() {
  const auth0 = useAuth0()
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    draken.configure({
      endpoint: String(import.meta.env.VITE_DRAKEN_ENDPOINT),
      idToken: () => auth0.getIdTokenClaims().then(a => a?.__raw ?? ''),
    })
  }, [])

  const update = useCallback(async (formData: FormData) => {
    try {
      const result = await draken.update(formData.contentId, {
        name: formData.name,
        description: formData.description,
        privacy: formData.privacy,
        fromTime: formData.fromTime ? new Date(formData.fromTime).toISOString() : undefined,
        toTime: formData.toTime ? new Date(formData.toTime).toISOString() : undefined,
      })
      console.info(result)
      alert('更新が完了しました')
      setFormData(initialFormData)
    } catch (error) {
      console.error(error)
      alert('更新に失敗しました')
    }
  }, [])

  return (
    <div>
      <h1>Update</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          update(formData)
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
          <label htmlFor="name">name </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData(d => ({ ...d, ...{ name: e.target.value } }))}
          />
        </div>
        <div>
          <label htmlFor="description">description</label>
          <input
            id="description"
            type="text"
            value={formData.description}
            onChange={e => setFormData(d => ({ ...d, ...{ description: e.target.value } }))}
          />
        </div>
        <div>
          <label htmlFor="privacy">公開設定</label>
          <select
            value={formData.privacy}
            onChange={e => setFormData(d => ({ ...d, ...{ privacy: e.target.value as any } }))}
          >
            <option value="public">public</option>
            <option value="private">private</option>
            <option value="restricted">restricted</option>
          </select>
        </div>
        <div>
          <label htmlFor="fromTime">公開開始期間 </label>
          <input
            id="fromTime"
            type="datetime-local"
            value={formData.fromTime}
            onChange={e => setFormData(d => ({ ...d, ...{ fromTime: e.target.value } }))}
          />
        </div>
        <div>
          <label htmlFor="toTime">公開終了期間</label>
          <input
            id="toTime"
            type="datetime-local"
            value={formData.toTime}
            onChange={e => setFormData(d => ({ ...d, ...{ toTime: e.target.value } }))}
          />
        </div>
        <div>
          <button>送信</button>
        </div>
      </form>
    </div>
  )
}

export default Update

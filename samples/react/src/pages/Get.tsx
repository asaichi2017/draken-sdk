import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import draken from 'draken-sdk'

type FormData = {
  contentId: string
}

const initialFormData: FormData = {
  contentId: '',
}

function Get() {
  const auth0 = useAuth0()
  const [formData, setFormData] = useState<FormData>(initialFormData)

  useEffect(() => {
    draken.configure({
      endpoint: String(import.meta.env.VITE_DRAKEN_ENDPOINT),
      idToken: () => auth0.getIdTokenClaims().then(a => a?.__raw ?? ''),
    })
  }, [])

  const get = useCallback(async (formData: FormData) => {
    try {
      const result = await draken.get(formData.contentId)
      alert(JSON.stringify(result, null, '  '))
    } catch (error) {
      console.error(error)
      alert('取得に失敗しました')
    }
  }, [])

  return (
    <div>
      <h1>Get</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          get(formData)
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

export default Get

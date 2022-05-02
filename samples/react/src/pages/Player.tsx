import { useAuth0 } from '@auth0/auth0-react'
import draken from 'draken-sdk'
import 'draken-sdk/dist/draken-sdk.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import './Player.css'

function Player() {
  const auth0 = useAuth0()
  const [contentID, setContentID] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<ReturnType<typeof draken['player']> | null>(null)

  // DOMのレンダリング後に一度だけ実行
  useEffect(() => {
    draken.configure({
      endpoint: String(import.meta.env.VITE_DRAKEN_ENDPOINT),
      // 公開設定の動画の場合必要無い
      idToken: () => auth0.getIdTokenClaims().then(a => a?.__raw ?? ''),
    })
    return () => {
      playerRef.current?.dispose()
    }
  }, [])

  const load = useCallback(contentID => {
    if (!videoRef.current) return
    playerRef.current = draken.player(videoRef.current, {
      // enablePlaybackRates: false,
      // enablePlaybackResume: false,
      // layout: 'fill',
      // bigPlayButton: false,
      // controlBar: false,
    })
    playerRef.current.load(contentID)
  }, [])

  return (
    <div>
      <h1>Player</h1>
      <form
        className="Player__form"
        onSubmit={e => {
          e.preventDefault()
          load(contentID)
        }}
      >
        <label htmlFor="contentID">コンテンツID </label>
        <input id="contentID" type="text" value={contentID} onChange={e => setContentID(e.target.value)} />
        <button>表示</button>
      </form>
      <video ref={videoRef} className="Player__video"></video>
    </div>
  )
}

export default Player

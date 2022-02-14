import { useAuth0 } from '@auth0/auth0-react'

function Login() {
  const { isAuthenticated, loginWithPopup, logout } = useAuth0()
  return (
    <div>
      <h1>ログイン</h1>
      {isAuthenticated ? (
        <>
          <div>ログイン済み</div>
          <button onClick={() => logout()}>ログアウト</button>
        </>
      ) : (
        <>
          <div>未ログイン</div>
          <button onClick={() => loginWithPopup()}>ログイン</button>
        </>
      )}
    </div>
  )
}

export default Login

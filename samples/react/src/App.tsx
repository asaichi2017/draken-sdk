import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter, Link } from 'react-router-dom'
import Router from './Router'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Auth0Provider
        domain={String(import.meta.env.VITE_AUTH0_DOMAIN)}
        clientId={String(import.meta.env.VITE_AUTH0_CLIENTID)}
        redirectUri={window.location.origin}
      >
        <div className="App">
          <nav className="App__navigation">
            <Link to="/">ログイン</Link>
            <Link to="/player">Player</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/reUpload">ReUpload</Link>
            <Link to="/resumeUpload">Resume Upload</Link>
            <Link to="/update">Update</Link>
            <Link to="/get">Get</Link>
          </nav>
          <div className="App__pageContent">
            <Router />
          </div>
        </div>
      </Auth0Provider>
    </BrowserRouter>
  )
}

export default App

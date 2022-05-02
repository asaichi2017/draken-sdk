import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Player from './pages/Player'
import Upload from './pages/Upload'
import ReUpload from './pages/ReUpload'
import Update from './pages/Update'
import Get from './pages/Get'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/player" element={<Player />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/reUpload" element={<ReUpload />} />
      <Route path="/update" element={<Update />} />
      <Route path="/get" element={<Get />} />
    </Routes>
  )
}

export default Router

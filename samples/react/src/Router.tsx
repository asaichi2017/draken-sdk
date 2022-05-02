import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Player from './pages/Player'
import Upload from './pages/Upload'
import Update from './pages/Update'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/player" element={<Player />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/update" element={<Update />} />
    </Routes>
  )
}

export default Router

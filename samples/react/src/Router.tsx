import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Player from './pages/Player'
import Upload from './pages/Upload'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/player" element={<Player />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  )
}

export default Router

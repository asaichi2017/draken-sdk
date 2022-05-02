import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Player from './pages/Player'
import Upload from './pages/Upload'
import ReUpload from './pages/ReUpload'
import ResumeUpload from './pages/ResumeUpload'
import Update from './pages/Update'
import Get from './pages/Get'
import Delete from './pages/Delete'
import DownloadVideo from './pages/DownloadVideo'
import UploadThumbnail from './pages/UploadThumbnail'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/player" element={<Player />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/reUpload" element={<ReUpload />} />
      <Route path="/resumeUpload" element={<ResumeUpload />} />
      <Route path="/update" element={<Update />} />
      <Route path="/get" element={<Get />} />
      <Route path="/delete" element={<Delete />} />
      <Route path="/downloadVideo" element={<DownloadVideo />} />
      <Route path="/uploadThumbnail" element={<UploadThumbnail />} />
    </Routes>
  )
}

export default Router

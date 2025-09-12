import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { isDemoMode } from './lib/supabase'
import { getTodayIST } from './lib/format'
import Header from './components/Header'
import DemoMode from './components/DemoMode'
import DatePage from './routes/DatePage'
import TopicPage from './routes/TopicPage'
import Admin from './routes/Admin'

function App() {
  if (isDemoMode) {
    return <DemoMode />
  }

  const todayIST = getTodayIST()

  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to={`/date/${todayIST}`} replace />} />
          <Route path="/date/:date" element={<DatePage />} />
          <Route path="/date/:date/topic/:slug" element={<TopicPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to={`/date/${todayIST}`} replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

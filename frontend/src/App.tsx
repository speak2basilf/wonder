import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Leads from './pages/Leads'
import Opportunities from './pages/Opportunities'
import Contacts from './pages/Contacts'
import Campaigns from './pages/Campaigns'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Notes from './pages/Notes'
import useAuth from './state/useAuth'

function Protected({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { isAuthenticated, logout } = useAuth()
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
        <Link to="/">Dashboard</Link>
        <Link to="/leads">Leads</Link>
        <Link to="/opportunities">Pipeline</Link>
        <Link to="/contacts">Contacts</Link>
        <Link to="/campaigns">Campaigns</Link>
        <Link to="/notes">Voice Notes</Link>
        <span style={{ marginLeft: 'auto' }}>
          {isAuthenticated ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </span>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/leads" element={<Protected><Leads /></Protected>} />
        <Route path="/opportunities" element={<Protected><Opportunities /></Protected>} />
        <Route path="/contacts" element={<Protected><Contacts /></Protected>} />
        <Route path="/campaigns" element={<Protected><Campaigns /></Protected>} />
        <Route path="/notes" element={<Protected><Notes /></Protected>} />
      </Routes>
    </div>
  )
}
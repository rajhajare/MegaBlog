import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Feed from './pages/Feed.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Editor from './pages/Editor.jsx'
import PostDetail from './pages/PostDetail.jsx'
import { useAuth } from './hooks/useAuth.js'

function Guarded({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { token, logout } = useAuth()
  return (
    <div className="container">
      <nav className="nav">
        <Link to="/" className="brand"><span className="brand-accent">Mega</span>Blog</Link>
        <div>
          <Link to="/new" className="btn ghost">Write</Link>
          {token ? (
            <button onClick={logout} className="btn">Logout</button>
          ) : (
            <>
              <Link to="/login" className="link">Login</Link>
              <Link to="/signup" className="btn">Signup</Link>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/new" element={<Guarded><Editor /></Guarded>} />
        <Route path="/edit/:id" element={<Guarded><Editor /></Guarded>} />
      </Routes>
    </div>
  )
}



import { useState } from 'react'
import { api } from '../api/client.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()
  const { login } = useAuth()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token)
      nav('/')
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="form">
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Login</button>
      </form>
    </div>
  )
}



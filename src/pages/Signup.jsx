import { useState } from 'react'
import { api } from '../api/client.js'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/signup', form)
      nav('/login')
    } catch (e) {
      setError(e?.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={onSubmit} className="form">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Create account</button>
      </form>
    </div>
  )
}



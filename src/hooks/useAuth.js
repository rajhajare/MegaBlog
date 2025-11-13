import { useSyncExternalStore } from 'react'

const store = {
  token: localStorage.getItem('token') || '',
  listeners: new Set(),
}

function setToken(t) {
  store.token = t || ''
  if (t) localStorage.setItem('token', t)
  else localStorage.removeItem('token')
  store.listeners.forEach(l => l())
}

export function useAuth() {
  const token = useSyncExternalStore(
    (cb) => { store.listeners.add(cb); return () => store.listeners.delete(cb) },
    () => store.token,
    () => store.token
  )

  function login(t) { setToken(t) }
  function logout() { setToken('') }

  return { token, login, logout }
}



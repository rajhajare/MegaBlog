import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { Link } from 'react-router-dom'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [q, setQ] = useState('')

  async function load() {
    const { data } = await api.get('/posts', { params: q ? { q } : {} })
    setPosts(data)
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="search">
        <input placeholder="Search posts" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" onClick={load}>Search</button>
      </div>
      <div className="grid">
        {posts.map(p => (
          <Link to={`/post/${p._id}`} key={p._id} className="card">
            {p.coverImageUrl && <img src={p.coverImageUrl} alt="cover" className="cover" />}
            <h3>{p.title}</h3>
            <p className="muted">by {p.author?.name} • {new Date(p.createdAt).toLocaleDateString()}</p>
            <p className="muted">❤ {p.likes?.length || 0} • 💬 {p.commentsCount || 0}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}



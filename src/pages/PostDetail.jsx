import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api/client.js'
import { useAuth } from '../hooks/useAuth.js'

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const { token } = useAuth()
  const [me, setMe] = useState(null)
  const nav = useNavigate()

  async function load() {
    const [{ data: p }, { data: c }] = await Promise.all([
      api.get(`/posts/${id}`),
      api.get(`/comments/${id}`)
    ])
    setPost(p)
    setComments(c)
  }

  useEffect(() => { load() }, [id])

  useEffect(() => {
    if (!token) { setMe(null); return }
    (async () => {
      try { const { data } = await api.get('/auth/me'); setMe(data.user) } catch {}
    })()
  }, [token])

  async function toggleLike() {
    const { data } = await api.post(`/posts/${id}/like`)
    setPost({ ...post, likes: Array.from({ length: data.likesCount }) })
  }

  async function addComment() {
    if (!text.trim()) return
    await api.post('/comments', { postId: id, content: text })
    setText('')
    load()
  }

  async function onDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await api.delete(`/posts/${id}`)
    nav('/')
  }

  if (!post) return <p>Loading...</p>

  return (
    <div>
      {post.coverImageUrl && <img src={post.coverImageUrl} className="cover-large" alt="cover" />}
      <h1>{post.title}</h1>
      <p className="muted">by {post.author?.name} • {new Date(post.createdAt).toLocaleString()}</p>
      {me && String(me.id || me._id) === String(post.author?._id) && (
        <div className="actions">
          <Link className="btn ghost" to={`/edit/${post._id}`}>Edit</Link>
          <button className="btn" onClick={onDelete}>Delete</button>
        </div>
      )}
      <div className="content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <div className="actions">
        <button className="btn" onClick={toggleLike}>❤ {post.likes?.length || 0}</button>
      </div>

      <h3>Comments</h3>
      {token && (
        <div className="comment-box">
          <textarea placeholder="Write a comment..." value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn" onClick={addComment}>Comment</button>
        </div>
      )}
      <div className="comments">
        {comments.map(c => (
          <div key={c._id} className="comment">
            <p className="muted">{c.author?.name} • {new Date(c.createdAt).toLocaleString()}</p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}



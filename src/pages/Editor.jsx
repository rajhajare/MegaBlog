import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { api } from '../api/client.js'
import { useNavigate, useParams } from 'react-router-dom'

export default function Editor() {
  const [title, setTitle] = useState('')
  const [contentHtml, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [coverImageUrl, setCover] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (!id) return
    (async () => {
      const { data } = await api.get(`/posts/${id}`)
      setTitle(data.title)
      setContent(data.contentHtml)
      setTags((data.tags||[]).join(', '))
      setCover(data.coverImageUrl||'')
    })()
  }, [id])

  async function onUpload(file) {
    const form = new FormData()
    form.append('image', file)
    const { data } = await api.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return data.url
  }

  async function onSubmit() {
    setError('')
    try {
      const payload = { title, contentHtml, coverImageUrl, tags: tags.split(',').map(t=>t.trim()).filter(Boolean) }
      if (id) await api.put(`/posts/${id}`, payload)
      else await api.post('/posts', payload)
      nav('/')
    } catch (e) {
      setError(e?.response?.data?.message || 'Save failed')
    }
  }

  return (
    <div className="editor">
      <input className="title" placeholder="Post title" value={title} onChange={e=>setTitle(e.target.value)} />

      <div className="toolbar">
        <input placeholder="Cover image URL" value={coverImageUrl} onChange={e=>setCover(e.target.value)} />
        <label className="btn">
          Upload cover
          <input type="file" accept="image/*" style={{ display:'none' }} onChange={async (e)=>{
            const f = e.target.files?.[0]; if (!f) return; const url = await onUpload(f); setCover(url)
          }} />
        </label>
        <input placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
      </div>

      {coverImageUrl && <img src={coverImageUrl} alt="cover" className="cover-large" />}

      <ReactQuill theme="snow" value={contentHtml} onChange={setContent} />

      {error && <p className="error">{error}</p>}
      <button className="btn primary" onClick={onSubmit}>{id ? 'Update' : 'Publish'}</button>
    </div>
  )
}



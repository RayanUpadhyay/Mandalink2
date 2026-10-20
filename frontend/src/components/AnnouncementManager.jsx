import { useState, useEffect, useRef } from 'react'
import { api, apiBase } from '../api.js'
import { ANNOUNCEMENT_CATEGORIES, categoryLabel, formatAnnouncementDate } from '../utils/announcementCategories.js'
import { resizeImageKeepAspect } from '../utils/imageResizeAspect.js'
import './AnnouncementManager.css'

const MAX_TITLE = 120
const MAX_BODY = 600

// Admin-only panel (rendered inside the Admin page). The backend re-checks the
// admin's login token on every request, so hiding this UI is only a convenience.
export default function AnnouncementManager() {
  const [list, setList] = useState([])
  const [loadingList, setLoadingList] = useState(true)

  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('mandalink')
  const [pinned, setPinned] = useState(false)
  const [newImage, setNewImage] = useState(null)             // data URI picked in this session
  const [existingImagePath, setExistingImagePath] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)

  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const fileRef = useRef(null)
  const formRef = useRef(null)

  const load = () => {
    api.adminGetAnnouncements()
      .then(res => { if (res.success) setList(res.announcements) })
      .catch(() => {})
      .finally(() => setLoadingList(false))
  }
  useEffect(load, [])

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setBody('')
    setCategory('mandalink')
    setPinned(false)
    setNewImage(null)
    setExistingImagePath(null)
    setRemoveImage(false)
  }

  const startEdit = (a) => {
    setEditingId(a.id)
    setTitle(a.title)
    setBody(a.body || '')
    setCategory(a.category)
    setPinned(!!a.pinned)
    setNewImage(null)
    setExistingImagePath(a.imagePath || null)
    setRemoveImage(false)
    setMessage(null)
    if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    setMessage(null)
    try {
      const uri = await resizeImageKeepAspect(file)
      setNewImage(uri)
      setRemoveImage(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not process that image.' })
    }
  }

  const clearImage = () => {
    if (newImage) setNewImage(null)
    else if (existingImagePath) setRemoveImage(true)
  }

  const submit = async () => {
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Add a title first.' })
      return
    }
    setBusy(true)
    setMessage(null)
    const payload = { title, body, category, pinned, imageDataUri: newImage, removeImage: removeImage && !newImage }
    try {
      const res = editingId
        ? await api.adminUpdateAnnouncement(editingId, payload)
        : await api.adminCreateAnnouncement(payload)
      if (res.success) {
        setMessage({ type: 'success', text: editingId ? 'Announcement updated.' : 'Announcement published.' })
        resetForm()
        load()
      } else {
        setMessage({ type: 'error', text: res.message || 'Could not save that.' })
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Could not reach the server.' })
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    setBusy(true)
    setMessage(null)
    try {
      const res = await api.adminDeleteAnnouncement(id)
      setMessage({ type: res.success ? 'success' : 'error', text: res.message })
      if (res.success) {
        if (editingId === id) resetForm()
        load()
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Could not reach the server.' })
    } finally {
      setConfirmDeleteId(null)
      setBusy(false)
    }
  }

  const previewSrc = newImage || (existingImagePath && !removeImage ? apiBase + existingImagePath : null)

  return (
    <div className="card am-card" ref={formRef}>
      <h3 className="am-h">Announcements</h3>
      <p className="helper am-sub">
        Posts appear instantly on the Mandalink board and on rayanupadhyay.com — both read the same database.
      </p>

      <div className="am-form">
        <div>
          <label className="am-label" htmlFor="am-title">Title</label>
          <input
            id="am-title"
            className="am-input"
            value={title}
            maxLength={MAX_TITLE}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. New: printable practice worksheets"
          />
        </div>

        <div className="am-row">
          <div className="am-grow">
            <label className="am-label" htmlFor="am-cat">Category</label>
            <select id="am-cat" className="am-input" value={category} onChange={e => setCategory(e.target.value)}>
              {ANNOUNCEMENT_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <label className="am-check">
            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
            📌 Pin to top
          </label>
        </div>

        <div>
          <label className="am-label" htmlFor="am-body">Short write-up</label>
          <textarea
            id="am-body"
            className="am-input am-textarea"
            value={body}
            maxLength={MAX_BODY}
            onChange={e => setBody(e.target.value)}
            placeholder="A few sentences. Line breaks are kept."
          />
          <div className="am-counter">{body.length}/{MAX_BODY}</div>
        </div>

        <div>
          <span className="am-label">Image (optional)</span>
          <div className="am-img-box">
            {previewSrc ? (
              <img className="am-preview" src={previewSrc} alt="Preview" />
            ) : (
              <div className="am-preview am-preview-empty">🖼️</div>
            )}
            <div className="am-img-actions">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              <button type="button" className="btn" disabled={busy} onClick={() => fileRef.current.click()}>
                {previewSrc ? 'Replace image' : 'Choose image'}
              </button>
              {previewSrc && (
                <button type="button" className="btn" disabled={busy} onClick={clearImage}>Remove image</button>
              )}
              <span className="am-hint">Photos are resized automatically. JPG, PNG or WebP.</span>
            </div>
          </div>
        </div>

        <div className="am-actions">
          <button className="btn primary" disabled={busy} onClick={submit}>
            {busy ? 'Saving...' : editingId ? 'Save changes' : 'Publish announcement'}
          </button>
          {editingId && (
            <button className="btn" disabled={busy} onClick={() => { resetForm(); setMessage(null) }}>Cancel editing</button>
          )}
        </div>
        {message && <div className={`am-msg ${message.type}`}>{message.text}</div>}
      </div>

      <div className="am-list-head">Published ({list.length})</div>
      {loadingList ? (
        <p className="helper" style={{ margin: 0 }}>Loading...</p>
      ) : list.length === 0 ? (
        <p className="helper" style={{ margin: 0 }}>Nothing posted yet.</p>
      ) : (
        list.map(a => (
          <div className="am-item" key={a.id}>
            {a.imagePath
              ? <img className="am-thumb" src={apiBase + a.imagePath} alt="" loading="lazy" />
              : <div className="am-thumb am-thumb-empty">📣</div>}
            <div className="am-item-main">
              <div className="am-item-title">{a.pinned && '📌 '}{a.title}</div>
              <div className="am-item-meta">
                <span className={`am-chip ${a.category}`}>{categoryLabel(a.category)}</span>
                <span>{formatAnnouncementDate(a.createdAt)}</span>
                {a.authorUsername && <span>· {a.authorUsername}</span>}
              </div>
            </div>
            <div className="am-item-actions">
              {confirmDeleteId === a.id ? (
                <>
                  <span className="am-confirm">Delete this?</span>
                  <button className="am-mini danger" disabled={busy} onClick={() => remove(a.id)}>Yes, delete</button>
                  <button className="am-mini" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="am-mini" disabled={busy} onClick={() => startEdit(a)}>Edit</button>
                  <button className="am-mini danger" disabled={busy} onClick={() => setConfirmDeleteId(a.id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api, imageUrl } from '../api.js'

export default function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [published, setPublished] = useState(false)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  useEffect(() => {
    if (isNew) return
    api.getProduct(id)
      .then((item) => {
        setTitle(item.title || '')
        setPrice(item.price?.toString() || '')
        setDescription(item.description || '')
        setPublished(Boolean(item.published))
        setExistingImages(item.images || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isNew])

  const previews = [
    ...existingImages.map((url) => ({ type: 'existing', src: url, file: null })),
    ...newImages.map((file) => ({ type: 'new', src: URL.createObjectURL(file), file })),
  ].slice(0, 5)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('published', published ? 'true' : 'false')
    formData.append('existingImages', JSON.stringify(existingImages.slice(0, 5)))
    newImages.slice(0, 5 - existingImages.length).forEach((file) => formData.append('images', file))

    try {
      if (isNew) await api.createProduct(formData)
      else await api.updateProduct(id, formData)
      navigate('/produkte')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Produkt "${title}" wirklich löschen?`)) return
    await api.deleteProduct(id)
    navigate('/produkte')
  }

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files || [])
    const available = Math.max(0, 5 - existingImages.length - newImages.length)
    setNewImages((current) => [...current, ...files.slice(0, available)])
    e.target.value = ''
  }

  const handleImageRemove = (idx) => {
    if (idx < existingImages.length) {
      setExistingImages(existingImages.filter((_, i) => i !== idx))
    } else {
      const newIdx = idx - existingImages.length
      setNewImages(newImages.filter((_, i) => i !== newIdx))
    }
  }

  if (loading) return <div className="page"><div className="empty"><p>Lade Produkt…</p></div></div>

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="page-eyebrow">
            <Link to="/produkte" className="crumb">Produkte</Link>
            <span className="crumb-sep">/</span>
            {isNew ? 'Neu' : 'Bearbeiten'}
          </p>
          <h1 className="page-title">{isNew ? 'Neues Produkt' : title || 'Produkt bearbeiten'}</h1>
        </div>

        <div className="page-head-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/produkte')}>Abbrechen</button>
          <button type="submit" form="product-form" className="btn btn-primary" disabled={saving}>
            {saving ? 'Speichert…' : isNew ? 'Erstellen' : 'Speichern'}
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      {error && <div className="empty"><p>{error}</p></div>}

      <form id="product-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="form-main">
          <section className="card-panel">
            <h2 className="panel-title">Basisdaten</h2>

            <label className="field">
              <span className="field-label">Titel *</span>
              <input type="text" className="field-input" placeholder="z. B. Platte, Shirt, Poster, Instrument" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>

            <label className="field">
              <span className="field-label">Preis (EUR) *</span>
              <input type="number" step="0.01" min="0" className="field-input" placeholder="z. B. 24.90" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>

            <label className="field">
              <span className="field-label">Beschreibung</span>
              <textarea className="field-textarea" rows="10" placeholder="Beschreibung…" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
          </section>

          <section className="card-panel">
            <h2 className="panel-title">Bilder <span className="panel-meta">{previews.length} / 5</span></h2>
            <p className="panel-help">Erstes Bild dient als Thumbnail in der Übersicht. Maximal 5 Bilder.</p>

            <div className="image-grid">
              {previews.map((img, idx) => (
                <div key={`${img.type}-${idx}-${img.src}`} className="image-tile">
                  <img src={imageUrl(img.src)} alt="" />
                  {idx === 0 && <span className="image-badge">Thumbnail</span>}
                  <button type="button" className="image-remove" onClick={() => handleImageRemove(idx)} aria-label="Entfernen">×</button>
                </div>
              ))}

              {previews.length < 5 && (
                <label className="image-upload">
                  <input type="file" accept="image/*" multiple onChange={handleImageAdd} hidden />
                  <span className="image-upload-plus">＋</span>
                  <span className="image-upload-text">Bild hinzufügen</span>
                </label>
              )}
            </div>
          </section>
        </div>

        <aside className="form-side">
          <section className="card-panel">
            <h2 className="panel-title">Status</h2>
            <label className="toggle">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              <span className="toggle-track"><span className="toggle-thumb" /></span>
              <span className="toggle-label">
                {published ? 'Veröffentlicht' : 'Entwurf'}
                <span className="toggle-hint">{published ? 'Im Shop sichtbar.' : 'Nicht öffentlich sichtbar.'}</span>
              </span>
            </label>
          </section>

          <section className="card-panel">
            <h2 className="panel-title">Vorschau</h2>
            <div className="preview">
              <div className="preview-image">{previews[0] ? <img src={imageUrl(previews[0].src)} alt="" /> : <span className="preview-empty">Kein Bild</span>}</div>
              <div className="preview-body">
                <div className="preview-title">{title || 'Produkttitel'}</div>
                <div className="preview-price">
                  {price ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(price)) : '—'}
                </div>
              </div>
            </div>
          </section>

          {!isNew && (
            <section className="card-panel danger-panel">
              <h2 className="panel-title">Gefahrenzone</h2>
              <p className="panel-help">Diese Aktion ist nicht rückgängig zu machen.</p>
              <button type="button" className="btn btn-danger btn-block" onClick={handleDelete}>Produkt löschen</button>
            </section>
          )}
        </aside>
      </form>
    </div>
  )
}

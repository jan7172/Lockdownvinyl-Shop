import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, imageUrl } from '../api.js'

function formatPrice(n) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function formatDate(iso) {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export default function Products() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await api.listProducts())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => items.filter((i) => {
    if (filter === 'published') return i.published
    if (filter === 'draft') return !i.published
    return true
  }), [items, filter])

  const stats = {
    total: items.length,
    published: items.filter((i) => i.published).length,
    draft: items.filter((i) => !i.published).length,
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Produkt "${item.title}" wirklich löschen?`)) return
    await api.deleteProduct(item.id)
    setItems((current) => current.filter((x) => x.id !== item.id))
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="page-eyebrow">Verwaltung</p>
          <h1 className="page-title">Produkte</h1>
          <p className="page-sub">
            {stats.total} Produkte insgesamt · {stats.published} veröffentlicht · {stats.draft} Entwurf
          </p>
        </div>

        <Link to="/produkte/neu" className="btn btn-primary">
          <span className="btn-plus">＋</span>
          Neues Produkt
        </Link>
      </header>

      <div className="filter-bar">
        <div className="tabs">
          <button className={`tab ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>
            Alle <span className="tab-count">{stats.total}</span>
          </button>
          <button className={`tab ${filter === 'published' ? 'is-active' : ''}`} onClick={() => setFilter('published')}>
            Veröffentlicht <span className="tab-count">{stats.published}</span>
          </button>
          <button className={`tab ${filter === 'draft' ? 'is-active' : ''}`} onClick={() => setFilter('draft')}>
            Entwurf <span className="tab-count">{stats.draft}</span>
          </button>
        </div>
      </div>

      {error && <div className="empty"><p>{error}</p></div>}
      {loading && <div className="empty"><p>Lade Produkte…</p></div>}

      {!loading && !error && filtered.length === 0 ? (
        <div className="empty"><p>Keine Produkte in dieser Auswahl.</p></div>
      ) : null}

      {!loading && !error && filtered.length > 0 && (
        <div className="table">
          <div className="table-head">
            <div>Produkt</div>
            <div>Preis</div>
            <div>Status</div>
            <div>Erstellt</div>
            <div className="table-actions-head">Aktionen</div>
          </div>

          {filtered.map((item) => (
            <div key={item.id} className="table-row">
              <div className="table-cell-product">
                <div className="thumb">
                  {item.thumbnail ? <img src={imageUrl(item.thumbnail)} alt="" /> : <span className="thumb-empty" />}
                </div>
                <div>
                  <div className="row-title">{item.title}</div>
                </div>
              </div>

              <div className="table-cell"><span className="cell-price">{formatPrice(item.price)}</span></div>

              <div className="table-cell">
                <span className={`badge ${item.published ? 'is-published' : 'is-draft'}`}>
                  <span className="badge-dot" />
                  {item.published ? 'Veröffentlicht' : 'Entwurf'}
                </span>
              </div>

              <div className="table-cell"><span className="cell-date">{formatDate(item.createdAt)}</span></div>

              <div className="table-actions">
                <Link to={`/produkte/${item.id}/bearbeiten`} className="action-btn" title="Bearbeiten">Bearbeiten</Link>
                <button className="action-btn action-danger" title="Löschen" onClick={() => handleDelete(item)}>Löschen</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

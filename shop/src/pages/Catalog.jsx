import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { api, imageUrl } from '../api.js'

const SORTS = [
  { key: 'newest', label: 'Neueste zuerst' },
  { key: 'price-asc', label: 'Preis aufsteigend' },
  { key: 'price-desc', label: 'Preis absteigend' },
  { key: 'title', label: 'Alphabetisch' },
]

function formatPrice(n) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export default function Catalog() {
  const [sort, setSort] = useState('newest')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.listProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const items = useMemo(() => {
    const arr = [...products]
    switch (sort) {
      case 'price-asc': return arr.sort((a, b) => a.price - b.price)
      case 'price-desc': return arr.sort((a, b) => b.price - a.price)
      case 'title': return arr.sort((a, b) => a.title.localeCompare(b.title))
      case 'newest':
      default: return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }, [products, sort])

  return (
    <>
      <section className="shop-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        <div className="container">
          <Reveal><p className="eyebrow"><span className="eyebrow-dot" />Aktuell im Bestand</p></Reveal>
          <Reveal delay={80}><h1 className="shop-hero-title">Produkte,<br /><em>handverlesen</em>.</h1></Reveal>
          <Reveal delay={180}><p className="shop-hero-sub">Platten, Merch, Instrumente und mehr — ausgewählt und gepflegt.</p></Reveal>
        </div>
      </section>

      <section className="catalog">
        <div className="container">
          <div className="catalog-bar">
            <span className="catalog-count">{items.length} {items.length === 1 ? 'Produkt' : 'Produkte'}</span>
            <div className="sort">
              <label htmlFor="sort-select" className="sort-label">Sortieren:</label>
              <select id="sort-select" className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {loading && <div className="empty"><p>Lade Produkte…</p></div>}
          {error && <div className="empty"><p>{error}</p></div>}

          {!loading && !error && (
            <div className="catalog-grid">
              {items.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 80} className="card-wrap">
                  <Link to={`/produkt/${item.id}`} className="card">
                    <div className="card-image">
                      {item.thumbnail ? <img src={imageUrl(item.thumbnail)} alt={item.title} loading="lazy" /> : null}
                      <span className="card-image-fade" />
                    </div>
                    <div className="card-body">
                      <div className="card-meta" />
                      <h2 className="card-title">{item.title}</h2>
                      <div className="card-price">{formatPrice(item.price)}</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

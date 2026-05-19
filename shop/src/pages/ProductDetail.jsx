import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { api, imageUrl } from '../api.js'

function formatPrice(n) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export default function ProductDetail() {
  const { id } = useParams()

  const [item, setItem] = useState(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setActiveIdx(0)

    api.getProduct(id)
      .then(setItem)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="detail">
        <div className="container">
          <p>Lade Produkt…</p>
        </div>
      </div>
    )
  }

  if (notFound || !item) {
    return <Navigate to="/" replace />
  }

  const images = Array.isArray(item.images)
    ? item.images.filter(Boolean)
    : []

  const hasImages = images.length > 0

  const subject = encodeURIComponent(`Anfrage: ${item.title}`)
  const body = encodeURIComponent(
    `Hallo,\n\nich habe Interesse an "${item.title}".\n\nBitte um Rückmeldung.\n\nDanke!`
  )

  const mailto =
    `mailto:hallo@lockdownvinyl.de?subject=${subject}&body=${body}`

  return (
    <article className="detail">
      <div className="container">
        <Reveal>
          <Link to="/" className="back-link">
            ← Zurück zur Übersicht
          </Link>
        </Reveal>

        <div className={`detail-grid ${!hasImages ? 'detail-grid-no-image' : ''}`}>
          {hasImages && (
            <Reveal className="detail-media">
              <div className="detail-image-main">
                <img
                  key={activeIdx}
                  src={imageUrl(images[activeIdx])}
                  alt={item.title}
                />
              </div>

              {images.length > 1 && (
                <div className="detail-thumbs">
                  {images.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      className={`detail-thumb ${i === activeIdx ? 'is-active' : ''}`}
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Bild ${i + 1} anzeigen`}
                      type="button"
                    >
                      <img src={imageUrl(src)} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </Reveal>
          )}

          <div className="detail-info">
            <Reveal delay={80}>
              <p className="eyebrow">
                <span className="eyebrow-dot" />
                Verfügbar
              </p>
            </Reveal>

            <Reveal delay={140}>
              <h1 className="detail-title">{item.title}</h1>
            </Reveal>

            <Reveal delay={260}>
              <div className="detail-price">
                {formatPrice(item.price)}
              </div>
            </Reveal>

            <Reveal delay={340} className="detail-actions">
              <a className="btn btn-primary" href={mailto}>
                Per E-Mail anfragen
                <span className="btn-arrow" aria-hidden="true">→</span>
              </a>

              <a className="btn btn-ghost" href="tel:+491722658323">
                Anrufen
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </a>
            </Reveal>

            <Reveal delay={420}>
              <div className="detail-description">
                {(item.description || '')
                  .split('\n\n')
                  .map((p, i) => (
                    <p key={i}>
                      {p.split('\n').map((line, j, arr) => (
                        <span key={j}>
                          {line}
                          {j < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
              </div>
            </Reveal>

            <Reveal delay={500}>
              <div className="detail-note">
                <span className="note-dot" />
                Verkauf erfolgt vor Ort oder nach Absprache.
                Kein Online-Checkout — Anfragen per E-Mail oder Telefon.
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  )
}
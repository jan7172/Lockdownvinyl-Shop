import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <p className="eyebrow"><span className="eyebrow-dot" />404</p>
        <h1 className="not-found-title">Seite nicht gefunden.</h1>
        <p className="not-found-sub">
          Die angeforderte Seite existiert nicht oder wurde entfernt.
        </p>
        <Link to="/" className="btn btn-primary">
          Zur Übersicht
          <span className="btn-arrow">→</span>
        </Link>
      </div>
    </section>
  )
}

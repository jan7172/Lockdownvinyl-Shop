import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function Login() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.login(password)
      navigate('/produkte')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-bg" aria-hidden="true" />
      <div className="login-grain" aria-hidden="true" />

      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-dot" />
          </span>
          <div className="login-brand-text">
            <span className="login-brand-name">Lockdownvinyl</span>
            <span className="login-brand-sub">Adminpanel</span>
          </div>
        </div>

        <h1 className="login-title">Anmelden.</h1>
        <p className="login-sub">Ein Passwort schützt das Adminpanel.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Passwort</span>
            <div className="field-input-wrap">
              <input
                type={show ? 'text' : 'password'}
                className="field-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'Passwort verbergen' : 'Passwort anzeigen'}
              >
                {show ? 'Verbergen' : 'Anzeigen'}
              </button>
            </div>
          </label>

          {error && <p className="login-note">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Prüfe…' : 'Anmelden'}
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </form>

        <p className="login-note">Geschützter Bereich. Zugang nur für autorisierte Personen.</p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function Settings() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword !== repeatPassword) {
      setError('Das neue Passwort und die Wiederholung stimmen nicht überein.')
      return
    }
    setSaving(true)
    try {
      await api.changePassword({ currentPassword, newPassword })
      api.logout()
      setSuccess('Passwort geändert. Bitte mit dem neuen Passwort erneut anmelden.')
      setCurrentPassword('')
      setNewPassword('')
      setRepeatPassword('')
      setTimeout(() => navigate('/login', { replace: true }), 900)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page page-narrow">
      <header className="page-head">
        <div>
          <p className="page-eyebrow">Sicherheit</p>
          <h1 className="page-title">Einstellungen</h1>
          <p className="page-sub">Admin-Passwort lokal ändern. Das Passwort wird nur als bcrypt-Hash gespeichert.</p>
        </div>
      </header>

      <form className="card-panel settings-panel" onSubmit={handleSubmit}>
        <div>
          <h2 className="panel-title">Passwort ändern</h2>
          <p className="panel-help">Nach der Änderung wirst du automatisch abgemeldet.</p>
        </div>

        <label className="field">
          <span className="field-label">Aktuelles Passwort *</span>
          <input type={showPasswords ? 'text' : 'password'} className="field-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" required />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Neues Passwort *</span>
            <input type={showPasswords ? 'text' : 'password'} className="field-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" required />
          </label>
          <label className="field">
            <span className="field-label">Wiederholen *</span>
            <input type={showPasswords ? 'text' : 'password'} className="field-input" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} autoComplete="new-password" required />
          </label>
        </div>

        <label className="check-row">
          <input type="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} />
          <span>Passwörter anzeigen</span>
        </label>

        <div className="password-rules"><strong>Regeln:</strong> mindestens 10 Zeichen, Großbuchstabe, Kleinbuchstabe, Zahl und Sonderzeichen.</div>
        {error && <p className="notice notice-error">{error}</p>}
        {success && <p className="notice notice-success">{success}</p>}
        <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Speichert…' : 'Passwort speichern'}<span className="btn-arrow" aria-hidden="true">→</span></button></div>
      </form>

      <section className="card-panel settings-panel">
        <h2 className="panel-title">Passwort vergessen</h2>
        <p className="panel-help">Ohne Maildienst gibt es keinen Browser-Reset. Wer Serverzugriff hat, setzt das Passwort per Terminal zurück.</p>
        <pre className="code-block">ADMIN_PASSWORD='NeuesSicheresPasswort2026!' npm run reset-admin-password</pre>
      </section>
    </div>
  )
}

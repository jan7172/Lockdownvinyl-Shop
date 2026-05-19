import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './db.js'

const ADMIN_PASSWORD_KEY = 'admin_password_hash'

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET muss gesetzt sein und mindestens 32 Zeichen haben.')
  }
  return secret
}

export function validatePasswordStrength(password) {
  const value = String(password || '')
  if (value.length < 10) return 'Passwort muss mindestens 10 Zeichen haben.'
  if (!/[A-ZÄÖÜ]/.test(value)) return 'Passwort braucht mindestens einen Großbuchstaben.'
  if (!/[a-zäöüß]/.test(value)) return 'Passwort braucht mindestens einen Kleinbuchstaben.'
  if (!/[0-9]/.test(value)) return 'Passwort braucht mindestens eine Zahl.'
  if (!/[^A-Za-z0-9ÄÖÜäöüß]/.test(value)) return 'Passwort braucht mindestens ein Sonderzeichen.'
  return null
}

export function hasAdminPassword() {
  return Boolean(db.prepare('SELECT value FROM settings WHERE key = ?').get(ADMIN_PASSWORD_KEY))
}

export async function setAdminPassword(password) {
  const validationError = validatePasswordStrength(password)
  if (validationError) throw new Error(validationError)
  const hash = await bcrypt.hash(password, 12)
  db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(ADMIN_PASSWORD_KEY, hash)
}

export async function verifyAdminPassword(password) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(ADMIN_PASSWORD_KEY)
  if (!row) return false
  return bcrypt.compare(password || '', row.value)
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const ok = await verifyAdminPassword(currentPassword)
  if (!ok) throw new Error('Aktuelles Passwort ist falsch.')
  await setAdminPassword(newPassword)
}

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, getJwtSecret(), { expiresIn: '8h' })
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Nicht angemeldet.' })
  try {
    const payload = jwt.verify(token, getJwtSecret())
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Kein Admin-Zugriff.' })
    req.admin = payload
    next()
  } catch {
    res.status(401).json({ error: 'Session abgelaufen oder ungültig.' })
  }
}

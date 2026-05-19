import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { db, migrate, productFromRow } from './db.js'
import { changeAdminPassword, hasAdminPassword, requireAdmin, setAdminPassword, signAdminToken, verifyAdminPassword } from './auth.js'

dotenv.config()
migrate()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = Number(process.env.PORT || 4000)
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`
const uploadDir = path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174')
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean)

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (corsOrigins.includes(origin)) return true
  // Lokalentwicklung: Vite kann bei belegten Ports ausweichen. Deshalb alle localhost/127.0.0.1-Ports erlauben.
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
}

fs.mkdirSync(uploadDir, { recursive: true })

const loginAttempts = new Map()
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 8

function loginRateLimit(req, res, next) {
  const key = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const record = loginAttempts.get(key) || { count: 0, resetAt: now + LOGIN_WINDOW_MS }
  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + LOGIN_WINDOW_MS
  }
  record.count += 1
  loginAttempts.set(key, record)
  if (record.count > LOGIN_MAX_ATTEMPTS) {
    const minutes = Math.ceil((record.resetAt - now) / 60000)
    return res.status(429).json({ error: `Zu viele Loginversuche. Bitte in ${minutes} Minuten erneut versuchen.` })
  }
  next()
}

function resetLoginAttempts(req) {
  const key = req.ip || req.socket?.remoteAddress || 'unknown'
  loginAttempts.delete(key)
}

if (!hasAdminPassword() && process.env.ADMIN_PASSWORD) {
  await setAdminPassword(process.env.ADMIN_PASSWORD)
  console.log('Admin-Passwort aus .env initialisiert.')
}

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true)
    callback(new Error(`CORS blockiert Origin: ${origin}`))
  },
}))
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(uploadDir))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Nur Bilder sind erlaubt.'))
    cb(null, true)
  },
})

function parseProductBody(body) {
  const title = String(body.title || '').trim()
  const description = String(body.description || '').trim()
  const price = Number(body.price)
  const published = body.published === true || body.published === 'true' || body.published === 1 || body.published === '1'
  const existingImages = Array.isArray(body.existingImages)
    ? body.existingImages
    : body.existingImages
      ? JSON.parse(body.existingImages)
      : []

  if (!title) throw new Error('Titel ist erforderlich.')
  if (!Number.isFinite(price) || price < 0) throw new Error('Preis muss eine positive Zahl sein.')

  return { title, description, price, published, existingImages }
}

function upsertImages(productId, existingImages, files = []) {
  db.prepare('DELETE FROM product_images WHERE product_id = ?').run(productId)
  const insert = db.prepare('INSERT INTO product_images (id, product_id, url, sort_order) VALUES (?, ?, ?, ?)')

  const newUrls = files.map((file) => `${publicBaseUrl}/uploads/${file.filename}`)
  const urls = [...existingImages, ...newUrls].slice(0, 5)

  urls.forEach((url, index) => {
    insert.run(crypto.randomUUID(), productId, String(url), index)
  })
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/login', loginRateLimit, async (req, res) => {
  const ok = await verifyAdminPassword(req.body?.password)
  if (!ok) return res.status(401).json({ error: 'Falsches Passwort.' })
  resetLoginAttempts(req)
  res.json({ token: signAdminToken() })
})

app.post('/api/auth/change-password', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {}
    await changeAdminPassword(currentPassword, newPassword)
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message || 'Passwort konnte nicht geändert werden.' })
  }
})

app.get('/api/products', (req, res) => {
  const includeDrafts = req.query.includeDrafts === 'true'
  const rows = db.prepare(`
    SELECT * FROM products
    ${includeDrafts ? '' : 'WHERE published = 1'}
    ORDER BY created_at DESC
  `).all()
  res.json(rows.map(productFromRow))
})

app.get('/api/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!row || (!row.published && req.query.includeDrafts !== 'true')) {
    return res.status(404).json({ error: 'Produkt nicht gefunden.' })
  }
  res.json(productFromRow(row))
})

app.post('/api/admin/products', requireAdmin, upload.array('images', 5), (req, res) => {
  try {
    const input = parseProductBody(req.body)
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    db.prepare(`
      INSERT INTO products (id, title, description, price, published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, input.title, input.description, input.price, input.published ? 1 : 0, now, now)
    upsertImages(id, input.existingImages, req.files)
    res.status(201).json(productFromRow(db.prepare('SELECT * FROM products WHERE id = ?').get(id)))
  } catch (err) {
    res.status(400).json({ error: err.message || 'Produkt konnte nicht erstellt werden.' })
  }
})

app.put('/api/admin/products/:id', requireAdmin, upload.array('images', 5), (req, res) => {
  try {
    const input = parseProductBody(req.body)
    const current = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    if (!current) return res.status(404).json({ error: 'Produkt nicht gefunden.' })

    db.prepare(`
      UPDATE products SET title = ?, description = ?, price = ?, published = ?, updated_at = ? WHERE id = ?
    `).run(input.title, input.description, input.price, input.published ? 1 : 0, new Date().toISOString(), req.params.id)
    upsertImages(req.params.id, input.existingImages, req.files)
    res.json(productFromRow(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)))
  } catch (err) {
    res.status(400).json({ error: err.message || 'Produkt konnte nicht gespeichert werden.' })
  }
})

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Produkt nicht gefunden.' })
  res.status(204).end()
})

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || 'Ungültige Anfrage.' })
})

app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`)
})

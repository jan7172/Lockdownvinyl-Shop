import dotenv from 'dotenv'
import { migrate } from './db.js'
import { setAdminPassword } from './auth.js'

dotenv.config()
migrate()

const password = process.env.ADMIN_PASSWORD
if (!password) {
  console.error('Bitte ADMIN_PASSWORD in backend/.env setzen.')
  process.exit(1)
}

await setAdminPassword(password)
console.log('Admin-Passwort wurde gehashed gespeichert.')

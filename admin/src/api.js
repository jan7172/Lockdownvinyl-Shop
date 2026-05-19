const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const TOKEN_KEY = 'lockdownvinyl_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function imageUrl(url) {
  if (!url) return ''
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  if (res.status === 401) clearToken()
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'API-Fehler')
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  logout: () => clearToken(),
  login: async (password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setToken(data.token)
    return data
  },
  listProducts: () => request('/api/products?includeDrafts=true'),
  getProduct: (id) => request(`/api/products/${id}?includeDrafts=true`),
  createProduct: (formData) => request('/api/admin/products', { method: 'POST', body: formData }),
  updateProduct: (id, formData) => request(`/api/admin/products/${id}`, { method: 'PUT', body: formData }),
  deleteProduct: (id) => request(`/api/admin/products/${id}`, { method: 'DELETE' }),
  changePassword: ({ currentPassword, newPassword }) => request('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  }),
}

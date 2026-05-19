const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export function imageUrl(url) {
  if (!url) return ''
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, options)
  } catch (err) {
    throw new Error(`Backend nicht erreichbar: ${API_BASE_URL}`)
  }
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'API-Fehler')
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  listProducts: () => request('/api/products'),
  getProduct: (id) => request(`/api/products/${id}`),
}

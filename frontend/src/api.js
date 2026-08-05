const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const token = localStorage.getItem('mandalink_token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  register: (username, email, password) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),

  login: (username, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  getRadicals: (q) =>
    request(`/api/radicals${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  getRandomRadical: () =>
    request('/api/radicals/random'),

  getLeaderboard: () =>
    request('/api/leaderboard'),

  addXp: (username, amount) =>
    request(`/api/users/${encodeURIComponent(username)}/xp`, { method: 'POST', body: JSON.stringify({ amount }) }),

  chat: (message) =>
    request('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message }) })
}

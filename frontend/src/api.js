const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const API_BASE = RAW_API_BASE.replace(/\/+$/, '')

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

  getRadicals: (q, tier) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (tier) params.set('tier', tier)
    const qs = params.toString()
    return request(`/api/radicals${qs ? `?${qs}` : ''}`)
  },

  getRadicalOfTheDay: () =>
    request('/api/radicals/of-the-day'),

  getRandomRadical: () =>
    request('/api/radicals/random'),

  getRadicalCount: () =>
    request('/api/radicals/count'),

  getLeaderboard: () =>
    request('/api/leaderboard'),

  addXp: (username, amount) =>
    request(`/api/users/${encodeURIComponent(username)}/xp`, { method: 'POST', body: JSON.stringify({ amount }) }),

  chat: (message) =>
    request('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),

  forgotPassword: (email) =>
    request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token, newPassword) =>
    request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),

  resetPasswordDirect: (username, email, newPassword) =>
    request('/api/auth/reset-password-direct', { method: 'POST', body: JSON.stringify({ username, email, newPassword }) }),

  googleAuth: (idToken) =>
    request('/api/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) }),

  forgotUsername: (email) =>
    request('/api/auth/forgot-username', { method: 'POST', body: JSON.stringify({ email }) }),

  getAdminStats: () => {
    const token = localStorage.getItem('mandalink_token')
    return request('/api/admin/stats', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  },

  setAdmin: (userId, isAdmin) => {
    const token = localStorage.getItem('mandalink_token')
    return request('/api/admin/set-admin', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ userId, isAdmin })
    })
  },

  trackPageView: (path) => {
    let sessionId = localStorage.getItem('mandalink_session_id')
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem('mandalink_session_id', sessionId)
    }
    return request('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ sessionId, path })
    }).catch(() => {}) // fire-and-forget — never let tracking break the app
  },

  getActiveBadgeDrop: () => request('/api/badge-drops/active'),

  claimBadgeDrop: (dropId) =>
    request('/api/badge-drops/claim', { method: 'POST', body: JSON.stringify({ dropId }) }),

  createBadgeDrop: (name, icon, description) => {
    const token = localStorage.getItem('mandalink_token')
    return request('/api/admin/badge-drops', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ name, icon, description })
    })
  },

  endBadgeDrop: () => {
    const token = localStorage.getItem('mandalink_token')
    return request('/api/admin/badge-drops/end', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  },

  deleteUser: (userId) => {
    const token = localStorage.getItem('mandalink_token')
    return request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  }
}

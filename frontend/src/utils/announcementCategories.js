// The three announcement categories. The `key` is what's stored in the database
// (and must match the backend's AnnouncementController.CATEGORIES); the `label`
// is what people see.
export const ANNOUNCEMENT_CATEGORIES = [
  { key: 'mandalink', label: 'Mandalink' },
  { key: 'rayanupadhyay', label: 'rayanupadhyay.com' },
  { key: 'other', label: 'Other' }
]

export function categoryLabel(key) {
  const c = ANNOUNCEMENT_CATEGORIES.find(c => c.key === key)
  return c ? c.label : 'Other'
}

// The backend sends LocalDateTime strings with microseconds; trim to
// milliseconds so every browser parses them.
export function formatAnnouncementDate(iso) {
  if (!iso) return ''
  const d = new Date(String(iso).replace(/(\.\d{3})\d+/, '$1'))
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

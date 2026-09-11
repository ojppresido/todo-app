export function toLocalDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getToday() {
  return toLocalDateString(new Date())
}

/**
 * Date-only strings ('YYYY-MM-DD') compare lexicographically, so there is no
 * timezone/day-shift risk when comparing against today.
 */
export function compareDueDate(dueDate, today) {
  if (!dueDate) return null
  if (dueDate < today) return 'overdue'
  if (dueDate === today) return 'today'
  return 'upcoming'
}

export function formatDueDate(dueDate) {
  if (!dueDate) return ''
  const [y, m, d] = dueDate.split('-').map(Number)
  if (!y || !m || !d) return dueDate
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
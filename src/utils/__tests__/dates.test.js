import { describe, it, expect } from 'vitest'
import { toLocalDateString, getToday, compareDueDate, formatDueDate } from '../dates'

describe('date utilities', () => {
  it('toLocalDateString formats a date in local time', () => {
    const d = new Date(2026, 0, 5, 23, 30)
    expect(toLocalDateString(d)).toBe('2026-01-05')
  })

  it('getToday returns a YYYY-MM-DD string', () => {
    expect(getToday()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('compares due dates against today without timezone shift', () => {
    const today = '2026-09-10'
    expect(compareDueDate('2026-09-09', today)).toBe('overdue')
    expect(compareDueDate('2026-09-10', today)).toBe('today')
    expect(compareDueDate('2026-09-11', today)).toBe('upcoming')
    expect(compareDueDate(null, today)).toBeNull()
  })

  it('formats a date-only string as readable text', () => {
    expect(formatDueDate('2026-09-10')).toBe('Thu, Sep 10, 2026')
    expect(formatDueDate('')).toBe('')
    expect(formatDueDate(null)).toBe('')
  })
})
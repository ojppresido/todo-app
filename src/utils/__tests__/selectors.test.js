import { describe, it, expect } from 'vitest'
import { filterAndSortTasks, computeCounts, hasDuplicateActiveTitle } from '../selectors'

const base = {
  id: 't',
  description: '',
  dueDate: null,
  completed: false,
  priority: 'medium',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
}

const tasks = [
  { ...base, id: '1', title: 'Alpha', priority: 'high', createdAt: '2026-09-01T00:00:00.000Z', dueDate: '2026-10-01' },
  { ...base, id: '2', title: 'Beta', priority: 'low', createdAt: '2026-09-02T00:00:00.000Z', dueDate: '2026-09-25', description: 'search me here' },
  { ...base, id: '3', title: 'Gamma', priority: 'medium', createdAt: '2026-09-03T00:00:00.000Z', dueDate: null, completed: true },
  { ...base, id: '4', title: 'Alpha second', priority: 'medium', createdAt: '2026-09-04T00:00:00.000Z', dueDate: '2026-11-01' },
]

describe('filterAndSortTasks', () => {
  it('defaults to newest first', () => {
    const out = filterAndSortTasks(tasks, { status: 'all', priority: 'all', search: '', sort: 'created-desc' })
    expect(out.map((t) => t.id)).toEqual(['4', '3', '2', '1'])
  })

  it('filters by status', () => {
    expect(filterAndSortTasks(tasks, { status: 'active', priority: 'all', search: '', sort: 'created-desc' }).map((t) => t.id)).toEqual(['4', '2', '1'])
    expect(filterAndSortTasks(tasks, { status: 'completed', priority: 'all', search: '', sort: 'created-desc' }).map((t) => t.id)).toEqual(['3'])
  })

  it('filters by priority and combines with status', () => {
    const out = filterAndSortTasks(tasks, { status: 'active', priority: 'high', search: '', sort: 'created-desc' })
    expect(out.map((t) => t.id)).toEqual(['1'])
  })

  it('searches title and description case-insensitively', () => {
    expect(filterAndSortTasks(tasks, { status: 'all', priority: 'all', search: 'ALPHA', sort: 'created-desc' }).map((t) => t.id)).toEqual(['4', '1'])
    expect(filterAndSortTasks(tasks, { status: 'all', priority: 'all', search: 'search me', sort: 'created-desc' }).map((t) => t.id)).toEqual(['2'])
  })

  it('sorts by due date ascending with nulls last', () => {
    const out = filterAndSortTasks(tasks, { status: 'all', priority: 'all', search: '', sort: 'due-asc' })
    const withoutDue = out.filter((t) => !t.dueDate).map((t) => t.id)
    const withDue = out.filter((t) => t.dueDate).map((t) => t.id)
    expect(withDue).toEqual(['2', '1', '4'])
    expect(withoutDue).toEqual(['3'])
    expect(out[out.length - 1].id).toBe('3')
  })

  it('sorts by priority high to low', () => {
    const out = filterAndSortTasks(tasks, { status: 'all', priority: 'all', search: '', sort: 'priority-desc' })
    expect(out.map((t) => t.id)).toEqual(['1', '4', '3', '2'])
  })

  it('returns a copy, not the original array', () => {
    const out = filterAndSortTasks(tasks, { status: 'all', priority: 'all', search: '', sort: 'created-desc' })
    expect(out).not.toBe(tasks)
  })
})

describe('computeCounts', () => {
  it('counts all, active and completed', () => {
    expect(computeCounts(tasks)).toEqual({ all: 4, active: 3, completed: 1 })
  })
})

describe('hasDuplicateActiveTitle', () => {
  it('is case-insensitive and ignores completed tasks', () => {
    const dupes = [
      { ...base, id: 'a', title: 'Build Report', completed: false },
      { ...base, id: 'b', title: 'build report', completed: true },
    ]
    expect(hasDuplicateActiveTitle(dupes, 'BUILD REPORT')).toBe(true)
    expect(hasDuplicateActiveTitle(dupes, 'Build Report', 'a')).toBe(false)
    expect(hasDuplicateActiveTitle([], 'Anything')).toBe(false)
  })
})
import { describe, it, expect, beforeEach } from 'vitest'
import { loadTasks, saveTasks, STORAGE_KEY } from '../storage'

function makeTasks() {
  return [
    {
      id: 'a',
      title: 'Buy milk',
      description: '',
      completed: false,
      dueDate: null,
      priority: 'medium',
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
    {
      id: 'b',
      title: 'Ship feature',
      description: 'Push to prod',
      completed: true,
      dueDate: '2026-09-20',
      priority: 'high',
      createdAt: '2026-09-02T00:00:00.000Z',
      updatedAt: '2026-09-02T00:00:00.000Z',
    },
  ]
}

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('round-trips tasks through localStorage', () => {
    const tasks = makeTasks()
    expect(loadTasks()).toBeNull()
    expect(saveTasks(tasks)).toBe(true)
    expect(loadTasks()).toEqual(tasks)
  })

  it('returns null when storage is empty', () => {
    expect(loadTasks()).toBeNull()
  })

  it('returns null and does not throw on corrupt JSON', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not valid json')
    expect(loadTasks()).toBeNull()
  })

  it('returns null on a wrong schema version', () => {
    const payload = JSON.stringify({ version: 99, tasks: makeTasks() })
    window.localStorage.setItem(STORAGE_KEY, payload)
    expect(loadTasks()).toBeNull()
  })

  it('drops invalid task entries but keeps valid ones', () => {
    const bad = { id: 'x', title: 'no priority', completed: false, priority: 'urgent' }
    const payload = JSON.stringify({ version: 1, tasks: [bad, makeTasks()[1]] })
    window.localStorage.setItem(STORAGE_KEY, payload)
    expect(loadTasks()).toEqual([makeTasks()[1]])
  })
})
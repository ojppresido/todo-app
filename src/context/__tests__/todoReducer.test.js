import { describe, it, expect, beforeEach } from 'vitest'
import { initialState, todoReducer } from '../todoReducer'

function makeTask(overrides = {}) {
  return {
    id: overrides.id ?? 'task-1',
    title: overrides.title ?? 'Task',
    description: overrides.description ?? '',
    dueDate: overrides.dueDate ?? null,
    priority: overrides.priority ?? 'medium',
    completed: overrides.completed ?? false,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  }
}

function stateWith(tasks) {
  return { ...initialState, tasks, hydrated: true }
}

describe('todoReducer task actions', () => {
  beforeEach(() => {})

  it('adds a task with trimmed fields and defaults', () => {
    const state = todoReducer(initialState, {
      type: 'task/add',
      payload: { title: '  Write docs  ', description: '  Do it  ', dueDate: '2026-09-15', priority: 'high' },
    })
    const task = state.tasks[0]
    expect(task.title).toBe('Write docs')
    expect(task.description).toBe('Do it')
    expect(task.dueDate).toBe('2026-09-15')
    expect(task.priority).toBe('high')
    expect(task.completed).toBe(false)
    expect(task.id).toBeTruthy()
  })

  it('toggles completion', () => {
    let state = stateWith([makeTask()])
    state = todoReducer(state, { type: 'task/toggle', payload: 'task-1' })
    expect(state.tasks[0].completed).toBe(true)
    state = todoReducer(state, { type: 'task/toggle', payload: 'task-1' })
    expect(state.tasks[0].completed).toBe(false)
  })

  it('updates a task and trims text', () => {
    let state = stateWith([makeTask()])
    state = todoReducer(state, {
      type: 'task/update',
      payload: { id: 'task-1', updates: { title: '   New title   ' } },
    })
    expect(state.tasks[0].title).toBe('New title')
  })

  it('does not touch other tasks on update', () => {
    let state = stateWith([makeTask({ id: 'a' }), makeTask({ id: 'b', title: 'Keep' })])
    state = todoReducer(state, { type: 'task/update', payload: { id: 'a', updates: { title: 'Changed' } } })
    expect(state.tasks.find((t) => t.id === 'b').title).toBe('Keep')
  })

  it('deletes one task', () => {
    let state = stateWith([makeTask({ id: 'a' }), makeTask({ id: 'b' })])
    state = todoReducer(state, { type: 'task/delete', payload: 'a' })
    expect(state.tasks.map((t) => t.id)).toEqual(['b'])
  })

  it('clears only completed tasks', () => {
    let state = stateWith([makeTask({ id: 'a' }), makeTask({ id: 'b', completed: true })])
    state = todoReducer(state, { type: 'tasks/clearCompleted' })
    expect(state.tasks.map((t) => t.id)).toEqual(['a'])
  })

  it('sets completion on many tasks', () => {
    let state = stateWith([makeTask({ id: 'a' }), makeTask({ id: 'b', completed: true }), makeTask({ id: 'c' })])
    state = todoReducer(state, { type: 'tasks/setCompleted', payload: { ids: ['a', 'b'], value: true } })
    expect(state.tasks.map((t) => t.completed)).toEqual([true, true, false])
  })

  it('deletes many tasks', () => {
    let state = stateWith([makeTask({ id: 'a' }), makeTask({ id: 'b' }), makeTask({ id: 'c' })])
    state = todoReducer(state, { type: 'tasks/deleteMany', payload: ['a', 'c'] })
    expect(state.tasks.map((t) => t.id)).toEqual(['b'])
  })
})

describe('todoReducer selection & filters', () => {
  it('toggles selection membership', () => {
    let state = stateWith([])
    state = todoReducer(state, { type: 'selection/toggle', payload: 'a' })
    expect(state.selection.has('a')).toBe(true)
    state = todoReducer(state, { type: 'selection/toggle', payload: 'a' })
    expect(state.selection.has('a')).toBe(false)
  })

  it('selection/mode keeps or clears selection', () => {
    let state = todoReducer(stateWith([]), { type: 'selection/toggle', payload: 'x' })
    state = todoReducer(state, { type: 'selection/mode', payload: true })
    expect(state.selectMode).toBe(true)
    expect(state.selection.has('x')).toBe(true)
    state = todoReducer(state, { type: 'selection/mode', payload: false })
    expect(state.selectMode).toBe(false)
    expect(state.selection.size).toBe(0)
  })

  it('updates filters, search and sort independently', () => {
    let state = stateWith([])
    state = todoReducer(state, { type: 'filter/status', payload: 'completed' })
    state = todoReducer(state, { type: 'filter/priority', payload: 'high' })
    state = todoReducer(state, { type: 'search/set', payload: 'abc' })
    state = todoReducer(state, { type: 'sort/set', payload: 'due-asc' })
    expect(state.filter).toEqual({ status: 'completed', priority: 'high' })
    expect(state.search).toBe('abc')
    expect(state.sort).toBe('due-asc')
  })

  it('filters/reset restores defaults and clears selection', () => {
    let state = todoReducer(stateWith([]), { type: 'filter/priority', payload: 'low' })
    state = todoReducer(state, { type: 'search/set', payload: 'x' })
    state = todoReducer(state, { type: 'selection/mode', payload: true })
    state = todoReducer(state, { type: 'filters/reset' })
    expect(state.filter).toEqual({ status: 'all', priority: 'all' })
    expect(state.sort).toBe('created-desc')
    expect(state.search).toBe('')
    expect(state.selectMode).toBe(false)
    expect(state.selection.size).toBe(0)
  })

  it('tasks/loaded replaces tasks and exits select mode', () => {
    let state = todoReducer(stateWith([]), { type: 'selection/mode', payload: true })
    state = todoReducer(state, { type: 'tasks/loaded', tasks: [makeTask()] })
    expect(state.hydrated).toBe(true)
    expect(state.tasks).toHaveLength(1)
    expect(state.selectMode).toBe(false)
  })

  it('ignores unknown actions', () => {
    const state = initialState
    expect(todoReducer(state, { type: 'nope' })).toBe(state)
  })
})
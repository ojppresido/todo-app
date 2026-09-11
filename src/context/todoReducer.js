import { createId } from '../utils/id'

export const initialState = {
  tasks: [],
  hydrated: false,
  filter: { status: 'all', priority: 'all' },
  sort: 'created-desc',
  search: '',
  selectMode: false,
  selection: new Set(),
}

function makeTask({ title, description = '', dueDate = null, priority }) {
  const now = new Date().toISOString()
  return {
    id: createId(),
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    dueDate: dueDate || null,
    priority,
    completed: false,
    createdAt: now,
    updatedAt: now,
  }
}

export function todoReducer(state, action) {
  switch (action.type) {
    case 'tasks/loaded':
      return {
        ...state,
        tasks: action.tasks,
        selectMode: false,
        selection: new Set(),
        hydrated: true,
      }

    case 'task/add': {
      const task = makeTask(action.payload)
      return { ...state, tasks: [task, ...state.tasks] }
    }

    case 'task/update': {
      const updates = { ...action.payload.updates }
      if (updates.title !== undefined) updates.title = updates.title.trim()
      if (updates.description !== undefined && typeof updates.description === 'string') {
        updates.description = updates.description.trim()
      }
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
            : t,
        ),
      }
    }

    case 'task/toggle':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
            : t,
        ),
      }

    case 'task/delete':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      }

    case 'tasks/clearCompleted':
      return {
        ...state,
        tasks: state.tasks.filter((t) => !t.completed),
      }

    case 'tasks/setCompleted': {
      const ids = new Set(action.payload.ids)
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          ids.has(t.id) ? { ...t, completed: action.payload.value, updatedAt: new Date().toISOString() } : t,
        ),
      }
    }

    case 'tasks/deleteMany': {
      const ids = new Set(action.payload)
      return {
        ...state,
        tasks: state.tasks.filter((t) => !ids.has(t.id)),
      }
    }

    case 'selection/mode':
      return {
        ...state,
        selectMode: action.payload,
        selection: action.payload ? state.selection : new Set(),
      }

    case 'selection/toggle': {
      const selection = new Set(state.selection)
      if (selection.has(action.payload)) selection.delete(action.payload)
      else selection.add(action.payload)
      return { ...state, selection }
    }

    case 'selection/set':
      return { ...state, selection: new Set(action.payload) }

    case 'selection/clear':
      return { ...state, selection: new Set() }

    case 'filter/status':
      return { ...state, filter: { ...state.filter, status: action.payload } }

    case 'filter/priority':
      return { ...state, filter: { ...state.filter, priority: action.payload } }

    case 'sort/set':
      return { ...state, sort: action.payload }

    case 'search/set':
      return { ...state, search: action.payload }

    case 'filters/reset':
      return {
        ...state,
        filter: { status: 'all', priority: 'all' },
        sort: 'created-desc',
        search: '',
        selectMode: false,
        selection: new Set(),
      }

    default:
      return state
  }
}
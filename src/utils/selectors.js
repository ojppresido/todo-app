import { PRIORITY_RANK } from '../constants'

export function filterAndSortTasks(tasks, { status, priority, search, sort }) {
  const q = search.trim().toLowerCase()

  const filtered = tasks.filter((task) => {
    if (status === 'active' && task.completed) return false
    if (status === 'completed' && !task.completed) return false
    if (priority !== 'all' && task.priority !== priority) return false
    if (q && !`${task.title} ${task.description}`.toLowerCase().includes(q)) return false
    return true
  })

  return [...filtered].sort((a, b) => {
    switch (sort) {
      case 'created-asc':
        return a.createdAt.localeCompare(b.createdAt)
      case 'due-asc':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      case 'priority-desc': {
        const diff = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]
        return diff !== 0 ? diff : b.createdAt.localeCompare(a.createdAt)
      }
      case 'created-desc':
      default:
        return b.createdAt.localeCompare(a.createdAt)
    }
  })
}

export function computeCounts(tasks) {
  let active = 0
  let completed = 0
  for (const task of tasks) {
    if (task.completed) completed += 1
    else active += 1
  }
  return { all: tasks.length, active, completed }
}

export function hasDuplicateActiveTitle(tasks, title, ignoreId) {
  const normalized = title.trim().toLowerCase()
  return tasks.some(
    (task) =>
      !task.completed &&
      task.id !== ignoreId &&
      task.title.trim().toLowerCase() === normalized,
  )
}
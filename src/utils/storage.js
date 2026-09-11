export const STORAGE_KEY = 'todo-app.tasks'
export const SCHEMA_VERSION = 1

function isValidTask(task) {
  return (
    task !== null &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.completed === 'boolean' &&
    (task.dueDate === null || typeof task.dueDate === 'string') &&
    ['high', 'medium', 'low'].includes(task.priority)
  )
}

function parseStored(raw) {
  const parsed = JSON.parse(raw)
  if (
    parsed === null ||
    typeof parsed !== 'object' ||
    parsed.version !== SCHEMA_VERSION ||
    !Array.isArray(parsed.tasks)
  ) {
    return null
  }
  return parsed.tasks.filter(isValidTask)
}

export function loadTasks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    return parseStored(raw)
  } catch {
    // Corrupt JSON, storage unavailable, etc. Fail gracefully.
    return null
  }
}

export function saveTasks(tasks) {
  try {
    const payload = JSON.stringify({ version: SCHEMA_VERSION, tasks })
    window.localStorage.setItem(STORAGE_KEY, payload)
    return true
  } catch {
    // Storage full or unavailable; the app keeps working in memory.
    return false
  }
}
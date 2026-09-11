export const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export const PRIORITIES = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const PRIORITY_RANK = { high: 3, medium: 2, low: 1 }

export const SORT_OPTIONS = [
  { value: 'created-desc', label: 'Newest first' },
  { value: 'created-asc', label: 'Oldest first' },
  { value: 'due-asc', label: 'Due date' },
  { value: 'priority-desc', label: 'Priority' },
]

export const DEFAULT_PRIORITY = 'medium'
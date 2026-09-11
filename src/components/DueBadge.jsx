import { compareDueDate, formatDueDate, getToday } from '../utils/dates'

const STYLES = {
  overdue: 'bg-red-50 text-red-700 ring-red-200',
  today: 'bg-amber-50 text-amber-700 ring-amber-200',
  upcoming: 'bg-slate-100 text-slate-600 ring-slate-200',
  scheduled: 'bg-slate-50 text-slate-500 ring-slate-200',
  none: 'bg-slate-50 text-slate-400 ring-slate-200',
}

export default function DueBadge({ dueDate, completed }) {
  const today = getToday()
  const when = completed ? null : compareDueDate(dueDate, today)

  let label = 'No due date'
  let style = STYLES.none

  if (dueDate) {
    if (completed) {
      label = formatDueDate(dueDate)
      style = STYLES.scheduled
    } else if (when === 'overdue') {
      label = `Overdue · ${formatDueDate(dueDate)}`
      style = STYLES.overdue
    } else if (when === 'today') {
      label = `Today`
      style = STYLES.today
    } else {
      label = formatDueDate(dueDate)
      style = STYLES.upcoming
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  )
}
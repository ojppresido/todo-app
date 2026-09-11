const STYLES = {
  high: 'bg-red-50 text-red-700 ring-red-200',
  medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  low: 'bg-sky-50 text-sky-700 ring-sky-200',
}

export default function PriorityBadge({ priority }) {
  const label = priority.charAt(0).toUpperCase() + priority.slice(1)
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[priority] ?? STYLES.medium}`}
    >
      {label}
    </span>
  )
}
import { useTodos } from '../context/TodoContext'
import DueBadge from './DueBadge'
import PriorityBadge from './PriorityBadge'

export default function TodoItem({
  task,
  selectMode,
  isSelected,
  onEdit,
  onDelete,
}) {
  const { dispatch } = useTodos()

  const titleId = `task-title-${task.id}`

  function toggle() {
    dispatch({ type: 'task/toggle', payload: task.id })
  }

  return (
    <li
      data-testid="todo-item"
      className={`group animate-fade-in rounded-lg border p-3 transition ${
        task.completed ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white hover:border-indigo-200'
      } ${isSelected ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'active' : 'complete'}`}
          onClick={toggle}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            task.completed
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-slate-300 bg-white text-transparent hover:border-indigo-400'
          }`}
        >
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {selectMode && (
          <input
            type="checkbox"
            aria-label={`Select ${task.title}`}
            checked={isSelected}
            onChange={() => dispatch({ type: 'selection/toggle', payload: task.id })}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
        )}

        <div className="min-w-0 flex-1">
          <p
            id={titleId}
            className={`break-words text-sm font-medium ${
              task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p
              className={`mt-0.5 break-words text-sm ${
                task.completed ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            <DueBadge dueDate={task.dueDate} completed={task.completed} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${task.title}`}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${task.title}`}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  )
}
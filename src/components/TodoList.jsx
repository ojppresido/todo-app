import { useMemo, useState } from 'react'
import { useTodos } from '../context/TodoContext'
import { filterAndSortTasks } from '../utils/selectors'
import TodoItem from './TodoItem'
import EditTaskModal from './EditTaskModal'
import ConfirmDialog from './ConfirmDialog'
import EmptyState from './EmptyState'

export default function TodoList() {
  const { state, dispatch } = useTodos()
  const [editingId, setEditingId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const visibleTasks = useMemo(
    () => filterAndSortTasks(state.tasks, { ...state.filter, search: state.search, sort: state.sort }),
    [state.tasks, state.filter, state.search, state.sort],
  )

  const editingTask = state.tasks.find((t) => t.id === editingId) ?? null
  const deletingTask = state.tasks.find((t) => t.id === deleting) ?? null
  const selectMode = state.selectMode

  if (state.tasks.length === 0) {
    return <EmptyState variant="empty" />
  }

  if (visibleTasks.length === 0) {
    return (
      <EmptyState
        variant="no-results"
        onReset={() => dispatch({ type: 'filters/reset' })}
      />
    )
  }

  return (
    <section aria-label="Task list" className="mt-4">
      <ul className="flex flex-col gap-2">
        {visibleTasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            selectMode={selectMode}
            isSelected={state.selection.has(task.id)}
            onEdit={() => setEditingId(task.id)}
            onDelete={() => setDeleting(task.id)}
          />
        ))}
      </ul>

      {editingTask && (
        <EditTaskModal task={editingTask} onClose={() => setEditingId(null)} />
      )}

      <ConfirmDialog
        open={deletingTask !== null}
        title="Delete task?"
        message={`"${deletingTask?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          if (deletingTask) dispatch({ type: 'task/delete', payload: deletingTask.id })
          setDeleting(null)
        }}
        onCancel={() => setDeleting(null)}
      />
    </section>
  )
}
import { useEffect, useRef, useState } from 'react'
import { useTodos } from '../context/TodoContext'
import { hasDuplicateActiveTitle } from '../utils/selectors'
import TaskFields from './TaskFields'

export default function EditTaskModal({ task, onClose }) {
  const { state, dispatch } = useTodos()
  const [values, setValues] = useState(() => ({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate || '',
    priority: task.priority,
  }))
  const [errors, setErrors] = useState({})
  const titleInputRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    titleInputRef.current?.focus()
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previouslyFocused = document.activeElement
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  function setField(key, value) {
    setValues((v) => ({ ...v, [key]: value }))
    if (key === 'title' && errors.title) setErrors((e) => ({ ...e, title: undefined }))
  }

  function handleSave(e) {
    e.preventDefault()
    const next = {}
    const title = values.title.trim()
    if (!title) next.title = 'Title is required.'
    else if (hasDuplicateActiveTitle(state.tasks, title, task.id)) next.title = 'A task with this title already exists.'
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    dispatch({
      type: 'task/update',
      payload: { id: task.id, updates: { ...values, dueDate: values.dueDate || null } },
    })
    onClose()
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit task"
        className="w-full max-w-lg animate-scale-in rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Edit task</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSave} noValidate>
          <TaskFields values={values} errors={errors} onChange={setField} titleRef={titleInputRef} />
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-700"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
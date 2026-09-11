import { useRef, useState } from 'react'
import { useTodos } from '../context/TodoContext'
import { DEFAULT_PRIORITY } from '../constants'
import { hasDuplicateActiveTitle } from '../utils/selectors'
import TaskFields from './TaskFields'

const EMPTY = { title: '', description: '', dueDate: '', priority: DEFAULT_PRIORITY }

export default function TodoForm() {
  const { state, dispatch } = useTodos()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const submittingRef = useRef(false)

  function setField(key, value) {
    setValues((v) => ({ ...v, [key]: value }))
    if (key === 'title' && errors.title) setErrors((e) => ({ ...e, title: undefined }))
  }

  function validate() {
    const next = {}
    const title = values.title.trim()
    if (!title) next.title = 'Title is required.'
    else if (hasDuplicateActiveTitle(state.tasks, title)) next.title = 'A task with this title already exists.'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (submittingRef.current) return
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    submittingRef.current = true
    dispatch({
      type: 'task/add',
      payload: {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate || null,
        priority: values.priority,
      },
    })
    setValues(EMPTY)
    setErrors({})
    submittingRef.current = false
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <TaskFields values={values} errors={errors} onChange={setField} titleInputId="task-title" />
      <div className="mt-4 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:justify-end">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-700"
        >
          Add task
        </button>
      </div>
    </form>
  )
}
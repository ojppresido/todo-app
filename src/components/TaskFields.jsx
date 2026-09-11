import { useId } from 'react'
import { PRIORITIES } from '../constants'

const inputClass = (hasError) =>
  `block w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition
   focus:ring-2 bg-white text-slate-900
   ${hasError
     ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
     : 'border-slate-300 focus:border-indigo-400 focus:ring-indigo-200'}`

export default function TaskFields({ values, errors, onChange, titleRef, titleInputId }) {
  const generatedTitleId = useId()
  const titleId = titleInputId ?? generatedTitleId
  const descId = useId()
  const dueId = useId()
  const priorityId = useId()

  return (
    <>
      <div>
        <label htmlFor={titleId} className="mb-1 block text-sm font-medium text-slate-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id={titleId}
          ref={titleRef}
          type="text"
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
          autoComplete="off"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          className={inputClass(errors.title)}
        />
        {errors.title && (
          <p id={`${titleId}-error`} role="alert" className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={descId} className="mb-1 block text-sm font-medium text-slate-700">
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id={descId}
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={2}
          placeholder="Add more detail…"
          className={inputClass(false)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={dueId} className="mb-1 block text-sm font-medium text-slate-700">
            Due date <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id={dueId}
            type="date"
            value={values.dueDate}
            onChange={(e) => onChange('dueDate', e.target.value)}
            className={inputClass(false)}
          />
        </div>

        <div>
          <label htmlFor={priorityId} className="mb-1 block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            id={priorityId}
            value={values.priority}
            onChange={(e) => onChange('priority', e.target.value)}
            className={inputClass(false)}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}
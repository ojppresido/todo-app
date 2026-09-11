export default function EmptyState({ variant, onReset }) {
  if (variant === 'no-results') {
    return (
      <div
        role="status"
        className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"
      >
        <svg className="h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
        </svg>
        <h2 className="mt-3 text-base font-semibold text-slate-700">No tasks match your filters</h2>
        <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters, or clear them.</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Clear filters &amp; search
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <svg className="h-12 w-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <h2 className="mt-3 text-base font-semibold text-slate-700">{"You're all caught up!"}</h2>
      <p className="mt-1 text-sm text-slate-500">
        Add your first task above and it will show up here.
      </p>
      <button
        type="button"
        onClick={() => document.getElementById('task-title')?.focus()}
        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add a task
      </button>
    </div>
  )
}
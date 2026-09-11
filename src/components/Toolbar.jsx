import { useEffect, useMemo, useRef, useState } from 'react'
import { useTodos } from '../context/TodoContext'
import { STATUS_TABS, PRIORITIES, SORT_OPTIONS } from '../constants'
import { computeCounts, filterAndSortTasks } from '../utils/selectors'
import ConfirmDialog from './ConfirmDialog'

const SEARCH_DEBOUNCE_MS = 250

function useDebouncedSearch(stateSearch, dispatch) {
  const [searchInput, setSearchInput] = useState(stateSearch)
  const timerRef = useRef(null)

  function onChangeSearch(value) {
    setSearchInput(value)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'search/set', payload: value })
    }, SEARCH_DEBOUNCE_MS)
  }

  useEffect(() => {
    setSearchInput(stateSearch)
    clearTimeout(timerRef.current)
  }, [stateSearch])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return [searchInput, onChangeSearch]
}

function TabButton({ tab, count, active, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
        active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {tab.label} <span className={active ? 'text-indigo-200' : 'text-slate-400'}>({count})</span>
    </button>
  )
}

export default function Toolbar() {
  const { state, dispatch } = useTodos()
  const [confirmClear, setConfirmClear] = useState(false)
  const [searchInput, onChangeSearch] = useDebouncedSearch(state.search, dispatch)

  const counts = useMemo(() => computeCounts(state.tasks), [state.tasks])
  const selectMode = state.selectMode
  const selectedCount = state.selection.size

  const visibleIds = useMemo(
    () =>
      new Set(
        filterAndSortTasks(state.tasks, { ...state.filter, search: state.search, sort: state.sort }).map(
          (t) => t.id,
        ),
      ),
    [state.tasks, state.filter, state.search, state.sort],
  )

  const allVisibleSelected =
    selectMode && visibleIds.size > 0 && [...visibleIds].every((id) => state.selection.has(id))

  function toggleSelectAllVisible() {
    const next = new Set(state.selection)
    if (allVisibleSelected) {
      for (const id of visibleIds) next.delete(id)
    } else {
      for (const id of visibleIds) next.add(id)
    }
    dispatch({ type: 'selection/set', payload: next })
  }

  return (
    <>
      <section aria-label="Filter and sort controls" className="mt-4 space-y-3">
        <div
          role="tablist"
          aria-label="Task status"
          className="inline-flex rounded-lg bg-slate-200/70 p-1"
        >
          {STATUS_TABS.map((tab) => (
            <TabButton
              key={tab.value}
              tab={tab}
              count={counts[tab.value]}
              active={state.filter.status === tab.value}
              onClick={() => dispatch({ type: 'filter/status', payload: tab.value })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Search tasks…"
              aria-label="Search tasks"
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
            {state.search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => dispatch({ type: 'search/set', payload: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={state.filter.priority}
              onChange={(e) => dispatch({ type: 'filter/priority', payload: e.target.value })}
              aria-label="Filter by priority"
              className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="all">All priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} priority
                </option>
              ))}
            </select>

            <select
              value={state.sort}
              onChange={(e) => dispatch({ type: 'sort/set', payload: e.target.value })}
              aria-label="Sort tasks"
              className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              aria-pressed={selectMode}
              onClick={() =>
                dispatch({ type: 'selection/mode', payload: !selectMode })
              }
              className={`rounded-md border px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                selectMode
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {selectMode ? 'Exit select' : 'Select multiple'}
            </button>
          </div>
        </div>

        {selectMode && (
          <div
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2"
            role="group"
            aria-label="Batch actions"
          >
            <label className="flex items-center gap-2 text-sm font-medium text-indigo-900">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAllVisible}
                disabled={visibleIds.size === 0}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                aria-label="Select all visible tasks"
              />
              <span>
                {selectedCount} task{selectedCount === 1 ? '' : 's'} selected
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={() => dispatch({ type: 'tasks/setCompleted', payload: { ids: [...state.selection], value: true } })}
                className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark complete
              </button>
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={() => dispatch({ type: 'tasks/setCompleted', payload: { ids: [...state.selection], value: false } })}
                className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark active
              </button>
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={() => {
                  dispatch({ type: 'tasks/deleteMany', payload: [...state.selection] })
                  dispatch({ type: 'selection/clear' })
                }}
                className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-300 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </section>

      {counts.completed > 0 && !selectMode && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Clear completed ({counts.completed})
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Clear completed tasks?"
        message={`${counts.completed} completed ${counts.completed === 1 ? 'task will' : 'tasks will'} be permanently removed.`}
        confirmLabel="Clear completed"
        danger
        onConfirm={() => {
          dispatch({ type: 'tasks/clearCompleted' })
          setConfirmClear(false)
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </>
  )
}
# Todo App

A focused, fast, and accessible todo application built with **React 18**, **TailwindCSS**, and **Vite**. Tasks persist in `localStorage` and sync between browser tabs.

## Features

- **Task management** — create, edit, delete (with confirmation), and toggle tasks
- **Rich tasks** — optional description, due date, and priority (High / Medium / Low)
- **Due-date aware** — overdue / today badges; completed tasks lose the overdue state
- **Filtering & search** — status tabs (All / Active / Completed) with live counts, priority filter, live search, and sorting (newest, oldest, due date, priority)
- **Batch operations** — "Select multiple" mode to complete, reopen, or delete many tasks at once, plus "Clear completed"
- **Persistence** — versioned `localStorage` schema, corrupt-data recovery, cross-tab sync via the `storage` event
- **Accessibility** — semantic HTML, keyboard navigation, focus management in dialogs, WCAG-AA-friendly contrast, `prefers-reduced-motion` support
- **Polish** — responsive from 320px up, empty / no-results states, subtle animations

## Getting started

Requires Node.js 18+ (npm 9+).

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build    # production build to ./dist
npm run preview  # preview the production build
npm test         # run the test suite (Vitest + React Testing Library)
npm run lint     # ESLint
```

## Project structure

```
src/
  components/        UI components (form, list, items, toolbar, dialogs, badges)
  context/           TodoProvider, reducer, and state wiring
  utils/             storage, date helpers, id generation, selectors
  test/              test setup
  __tests__/         integration tests
```

## Architecture decisions

- **State**: a single `useReducer` in `TodoProvider` holds tasks, filters, search, sort, and selection — one source of truth. Derived values (counts, filtered lists) come from pure selector functions wrapped in `useMemo`.
- **Persistence**: writes are debounced (~250 ms) and versioned (`{ version: 1, tasks: [...] }`), so future schema migrations are possible and corrupt data is ignored gracefully.
- **Dates**: stored as `YYYY-MM-DD` date-only strings and compared lexicographically, avoiding timezone day-shift bugs. Display formatting parses via `Date.UTC`.
- **Filters/sort/search** are pure functions in `utils/selectors.js` and fully unit-tested.

## Testing

45 tests across unit and integration suites:

- `utils/dates`, `utils/storage`, `utils/selectors`, `context/todoReducer` — unit tests
- `src/__tests__/App.test.jsx` — end-to-end flows: add/complete/edit/delete, validation, duplicate titles, filters, search + reset, batch select, clear completed, persistence, and corrupt-storage recovery
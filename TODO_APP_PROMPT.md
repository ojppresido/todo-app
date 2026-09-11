# Prompt: Build a Production-Ready Todo App with React.js + TailwindCSS

You are a senior frontend developer. Build a complete, production-ready Todo application using **React.js** (function components + hooks) and **TailwindCSS** (utility-first styling). No UI component libraries, no CSS frameworks other than Tailwind. You may use the **Vite** build tool as the project scaffold.

Follow the requirements below strictly. Do not build extra features beyond what is specified unless the specs explicitly ask, and do not skip any specified requirement. Where a choice is left open, pick the most sensible default and explain it in a brief comment or note.

---

## 1. Tech Stack

- React 18+
- TailwindCSS (latest, properly configured via `tailwind.config.js` + PostCSS)
- Vite as the build tool
- Plain TypeScript OR JavaScript — pick one and be consistent. If TypeScript, add strict typing everywhere.
- No external state-management library; use React's built-in hooks (`useState`, `useEffect`, `useReducer` as appropriate).
- No runtime drag-and-drop, animation, or utility libraries unless required by the specs below.

## 2. Core Features

### 2.1 Task Management
- Create a task with a title (required) and optional description, due date, and priority (High / Medium / Low).
- Edit any field of an existing task.
- Delete a task (with a confirmation so it can't be triggered by accident).
- Mark a task as **complete** / **incomplete** with a single click.
- Completed tasks must be visually distinct (strikethrough text + muted color), and their due date styling must change (see 2.4).

### 2.2 Task Model
```
{
  id: string (unique),
  title: string (required, non-empty),
  description: string (optional),
  completed: boolean,
  dueDate: ISO date string | null,
  priority: 'high' | 'medium' | 'low',
  createdAt: ISO date-time,
  updatedAt: ISO date-time
}
```

### 2.3 Filtering, Sorting & Search
- Filters: **All**, **Active**, **Completed** (segmented control or tabs).
- Priority filter: All / High / Medium / Low (can combine with status filter).
- Sort options: created date (newest/oldest first), due date (soonest first), priority (high to low). Default: created date newest first.
- Live search box that filters by task title and description as the user types (case-insensitive, matches partial words).

### 2.4 Due-Date & Overdue States
- Tasks with a due date that has passed and is **not completed** must show an **Overdue** badge and red-colored due date.
- Tasks due **today** show a "Today" badge in an amber/yellow tone.
- Tasks due later show a neutral tone.
- Completed tasks no longer show Overdue state.

### 2.5 Task Counts & Batch Operations
- Show live counts per status in the tabs (e.g., `Active (3)`).
- "Clear completed" button, visible only when there is at least one completed task, with a confirmation dialog.
- Select multiple tasks via checkboxes and perform batch actions: mark complete, mark active, delete.

### 2.6 Data Persistence
- Persist all data to **localStorage** with a sensible key (e.g., `todo-app.tasks`).
- Load persisted state on app startup and save on every change.
- Handle the edge case where localStorage contains corrupt or schema-invalid JSON: ignore it gracefully, start with an empty list, and do not crash.
- Version the stored schema (e.g., `{ version: 1, tasks: [...] }`) so future migrations are possible.

## 3. UI/UX Requirements

- Clean, modern, responsive design using only Tailwind utilities. Mobile-first: it must look good from 320px to desktop.
- Single-page layout: header (app title), input/form area, toolbar (search, filters, sort), task list, empty states.
- **Empty state**: when there are no tasks at all, show a friendly empty-state illustration/icon + message + CTA to add the first task.
- **No-results state**: when search/filters match nothing, show a distinct "no matches" message and a reset button.
- Adequate spacing, hover states on interactive elements, and `:focus-visible` rings for keyboard users.
- Basic entrance animation (fade/slide via Tailwind transition utilities) when a task is added or removed. Keep it subtle.

## 4. Forms & Validation

- Inline inline-edit form/modal reused for both "add task" and "edit task".
- Client-side validation:
  - Title required — non-empty after trimming; show an inline error message if empty.
  - Due date cannot be before... (allow past dates, but treat as overdue — do NOT block them; a user may be entering a late task). Do not enforce a minimum date.
  - Reject duplicate titles only if an **identical** (case-insensitive) task title already exists among active tasks — show a clear error.
- All inputs must be labeled (accessibility), including placeholder-driven native date input.
- Escape key closes the edit modal; clicking outside the modal closes it too. Prevent backdrop clicks bubbling to the list.

## 5. State Management & Architecture

- Split into sensible components (e.g., `App`, `TodoForm`, `TodoItem`, `TodoList`, `Toolbar`, `ConfirmDialog`, `EmptyState`) with props/callbacks. Do not over-split.
- Lift state to where it's needed; prefer `useReducer` for the task list if the actions grow complex, otherwise `useState` is fine.
- Single source of truth: one state object (or context) for tasks; derived values (counts, filtered lists) computed with `useMemo`.
- No prop drilling hell — use a Context if it genuinely reduces prop threading.

## 6. Edge Cases to Handle

- Rapid double-submit on the form (must not create duplicate tasks).
- Whitespace-only titles (trim before validating/saving).
- Very long titles/descriptions (must wrap gracefully, not overflow the layout).
- Updating/editing a task that no longer exists (guard against stale id, e.g., deleted while edit modal open).
- LocalStorage full / throws (wrap in try/catch, fail gracefully).
- Multiple tabs open on the same browser — sync via the `storage` event so both tabs stay consistent.
- Date handling across timezones: store due dates as date-only strings (`YYYY-MM-DD`); never convert with `new Date('YYYY-MM-DD')` directly in a way that shifts the day. Compare using local date boundaries.
- Filter + search + sort combined: the final list must respect all active criteria simultaneously and deterministically.

## 7. Accessibility (A11y)

- Semantic HTML: headings, `ul`/`li` for lists, `form`, `button`, `label`, `dialog`/`aria-modal` for modals.
- Keyboard navigation works end-to-end (Tab order, Enter/Space to toggle, Escape to close).
- ARIA attributes where needed: `aria-pressed` on toggle buttons, `aria-live` on the counter/feedback region, `role="status"`/`aria-atomic` for live messages.
- Focus management: on modal open, move focus to first input; on close, return focus to the trigger element.
- Color contrast conforms to WCAG AA at minimum. Red/amber/green should never be the only signal — pair with text, icons, and badges.
- Respect `prefers-reduced-motion` — disable the subtle animations for those users.

## 8. Performance

- Lists of even a few thousand tasks must remain responsive:
  - `useMemo` for filtered/sorted/search results.
  - Debounce the search input (≈200–300ms).
  - Batch localStorage writes (e.g., on a microtask/debounce) instead of writing on every keystroke.
- No unnecessary re-renders: memoize items where it clearly helps (e.g., `React.memo` for row components that receive stable props).
- Keep bundle size reasonable; don't import whole libraries for one utility.

## 9. Code Quality, Tests & Deliverables

- Follow a clean, readable structure. Naming must be self-documenting.
- No hardcoded UI strings scattered — use a small constants/config module (and/or `i18n`-ready structure) for labels, priorities, and statuses.
- Write tests (Vitest + React Testing Library) covering at minimum:
  - Add, complete, edit, delete task flows.
  - Validation (empty title, duplicate active title).
  - Filter + search + sort behavior.
  - localStorage persistence round-trip + corrupt-data recovery.
- All tests must pass with `npm test`. The dev server must start cleanly with `npm run dev`.

## 10. Final Checks Before Delivery

- Responsive at 320px, 768px, 1280px, and 1440px.
- No console warnings/errors in the browser in normal operation.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95.
- The app must be documented: a short README with setup, scripts, and project structure.

Deliver the complete, runnable project. Walk me through how to run it, and summarize the key architectural decisions you made and why.
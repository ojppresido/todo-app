import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { STORAGE_KEY } from '../utils/storage'

function makeStoredTask(overrides = {}) {
  return {
    id: 'stored-1',
    title: 'From storage',
    description: '',
    dueDate: null,
    priority: 'medium',
    completed: false,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  }
}

function seedStorage(tasks) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks }))
}

async function addTask(user, title, { description, dueDate, priority } = {}) {
  await user.type(screen.getByLabelText(/title/i), title)
  if (description) await user.type(screen.getByLabelText(/description/i), description)
  if (dueDate) {
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: dueDate } })
  }
  if (priority) {
    await user.selectOptions(screen.getByLabelText(/priority/i), priority)
  }
  await user.click(screen.getByRole('button', { name: /add task/i }))
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows the empty state when there are no tasks', () => {
    render(<App />)
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument()
  })

  it('adds a task and it appears in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Buy milk')
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(1)
  })

  it('ignores rapid double-submits so no duplicate task is created', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/title/i), 'Buy milk')
    const addButton = screen.getByRole('button', { name: /add task/i })
    await user.dblClick(addButton)
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(1)
  })

  it('shows validation error for an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/title/i), '   ')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('alert')).toHaveTextContent('Title is required.')
  })

  it('blocks duplicate active titles case-insensitively', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Buy milk')
    await addTask(user, 'BUY MILK')
    expect(screen.getByRole('alert')).toHaveTextContent('A task with this title already exists.')
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('allows a title that only exists on a completed task', async () => {
    const user = userEvent.setup()
    seedStorage([makeStoredTask({ completed: true })])
    render(<App />)
    await addTask(user, 'From storage')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getAllByText('From storage')).toHaveLength(2)
  })

  it('marks a task complete and it moves to the Completed tab', async () => {
    const user = userEvent.setup()
    seedStorage([makeStoredTask()])
    render(<App />)
    const checkbox = screen.getByRole('checkbox', { name: 'Mark "From storage" as complete' })
    await user.click(checkbox)
    expect(screen.getByRole('checkbox', { name: 'Mark "From storage" as active' })).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /completed/i }))
    expect(screen.getByText('From storage')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /active/i }))
    expect(screen.queryByText('From storage')).not.toBeInTheDocument()
  })

  it('edits a task through the modal', async () => {
    const user = userEvent.setup()
    seedStorage([makeStoredTask()])
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Edit From storage' }))
    const dialog = screen.getByRole('dialog', { name: /edit task/i })
    const titleInput = within(dialog).getByLabelText(/title/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'Renamed task')
    await user.click(within(dialog).getByRole('button', { name: /save changes/i }))
    expect(screen.getByText('Renamed task')).toBeInTheDocument()
    expect(screen.queryByText('From storage')).not.toBeInTheDocument()
  })

  it('deletes a task only after confirming', async () => {
    const user = userEvent.setup()
    seedStorage([makeStoredTask()])
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Delete From storage' }))
    const dialog = screen.getByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('From storage')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete From storage' }))
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }))
    expect(screen.queryByText('From storage')).not.toBeInTheDocument()
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument()
  })

  it('searches (debounced) and shows the no-results state with a working reset', async () => {
    const user = userEvent.setup()
    seedStorage([makeStoredTask()])
    render(<App />)
    await user.type(screen.getByRole('searchbox', { name: /search tasks/i }), 'zzz')
    expect(await screen.findByText('No tasks match your filters')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear filters/i }))
    expect(await screen.findByText('From storage')).toBeInTheDocument()
  })

  it('does batch complete through select mode', async () => {
    const user = userEvent.setup()
    seedStorage([
      makeStoredTask({ id: 'a', title: 'One' }),
      makeStoredTask({ id: 'b', title: 'Two' }),
    ])
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Select multiple' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select One' }))
    await user.click(screen.getByRole('checkbox', { name: 'Select Two' }))
    expect(screen.getByText('2 tasks selected')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mark complete' }))
    expect(screen.getAllByRole('checkbox', { name: /mark ".*" as active/i })).toHaveLength(2)
  })

  it('clears completed after confirmation', async () => {
    const user = userEvent.setup()
    seedStorage([makeStoredTask({ completed: true }), makeStoredTask({ id: 'b', title: 'Active one' })])
    render(<App />)
    await user.click(screen.getByRole('button', { name: /clear completed/i }))
    const dialog = screen.getByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: /clear completed/i }))
    expect(screen.queryByText('From storage')).not.toBeInTheDocument()
    expect(screen.getByText('Active one')).toBeInTheDocument()
  })

  it('persists added tasks and recovers from corrupt storage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Persist me')
    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
      expect(saved.tasks.find((t) => t.title === 'Persist me')).toBeTruthy()
    })
  })

  it('starts cleanly when localStorage holds corrupt data', async () => {
    window.localStorage.setItem(STORAGE_KEY, '{{{{ not json')
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument()
    await addTask(user, 'Still works')
    expect(screen.getByText('Still works')).toBeInTheDocument()
  })
})
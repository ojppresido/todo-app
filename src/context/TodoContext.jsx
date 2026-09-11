import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { initialState, todoReducer } from './todoReducer'
import { loadTasks, saveTasks, STORAGE_KEY } from '../utils/storage'

const TodoContext = createContext(null)

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)

  useEffect(() => {
    const tasks = loadTasks()
    dispatch({ type: 'tasks/loaded', tasks: tasks ?? [] })
  }, [])

  useEffect(() => {
    if (!state.hydrated) return
    const timer = setTimeout(() => saveTasks(state.tasks), 250)
    return () => clearTimeout(timer)
  }, [state.tasks, state.hydrated])

  useEffect(() => {
    function onStorage(event) {
      if (event.key !== STORAGE_KEY) return
      const tasks = loadTasks()
      if (tasks) dispatch({ type: 'tasks/loaded', tasks })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(
    () => ({ state, dispatch }),
    [state],
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

export function useTodos() {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error('useTodos must be used within a TodoProvider')
  return ctx
}
import { TodoProvider } from './context/TodoContext'
import Header from './components/Header'
import TodoForm from './components/TodoForm'
import Toolbar from './components/Toolbar'
import TodoList from './components/TodoList'

export default function App() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-slate-100">
        <Header />
        <main className="mx-auto w-full max-w-2xl px-4 py-8">
          <TodoForm />
          <Toolbar />
          <TodoList />
        </main>
      </div>
    </TodoProvider>
  )
}
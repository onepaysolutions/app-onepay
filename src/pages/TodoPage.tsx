import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

interface Todo {
  id: number
  title: string
  completed: boolean
}

function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    // 定义异步函数
    const getTodos = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
        
        if (error) {
          console.error('Error fetching todos:', error)
          return
        }

        if (data) {
          setTodos(data as Todo[])
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    getTodos()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">待办事项</h1>
      <ul className="space-y-2">
        {todos.map((todo: Todo) => (
          <li key={todo.id} className="p-2 border rounded">
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoPage 
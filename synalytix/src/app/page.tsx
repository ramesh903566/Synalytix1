import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <ul className="list-disc pl-5">
        {todos?.map((todo) => (
          <li key={todo.id} className="py-1">{todo.name}</li>
        ))}
        {(!todos || todos.length === 0) && (
          <p className="text-zinc-500">No todos found. Make sure you have a `todos` table with a `name` column.</p>
        )}
      </ul>
    </div>
  )
}

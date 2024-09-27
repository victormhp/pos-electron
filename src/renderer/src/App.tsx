import { useEffect, useState } from 'react'
import { collection, addDoc, QuerySnapshot, DocumentData, onSnapshot } from 'firebase/firestore'
import { Button, Input } from '@/components/ui'
import { db } from '@/services/firebase'

interface Product {
  id: string
  name: string
}

function App() {
  const [tasks, setTasks] = useState<Product[]>([])
  const taskCollection = collection(db, 'products')

  useEffect(() => {
    const unsubscribe = onSnapshot(taskCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      const updatedTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
      setTasks(updatedTasks)
    })

    return () => unsubscribe()
  }, [])

  async function addTask(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const task = formData.get('task')
    const newTask = {
      name: task
    }

    await addDoc(taskCollection, newTask)
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <form onSubmit={addTask} className="flex gap-4">
        <Input name="task" placeholder="Enter task" />
        <Button type="submit">Add</Button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App

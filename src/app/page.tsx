import AddTaskForm from "@/components/AddTaskForm";
import { createServerSupabaseClient } from "@/auth/client";

export default async function Home() {
  // Use the custom Supabase client you created
  const client = createServerSupabaseClient();

  // Query the 'tasks' table to render the list of tasks
  const { data, error } = await client.from("tasks").select();
  if (error) {
    throw error;
  }

  const tasks = data as [{ id: number; name: string; user_id: string }];
  console.log(tasks);

  return (
    <div>
      <h1>Tasks</h1>

      <div>
        {tasks?.map((task) => (
          <p key={task.id}>{task.name}</p>
        ))}
      </div>

      <AddTaskForm />
    </div>
  );
}

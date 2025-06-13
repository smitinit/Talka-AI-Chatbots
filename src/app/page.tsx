import AddTaskForm from "@/components/AddTaskForm";
import { createServerSupabaseClient } from "@/auth/client";

export default async function Home() {
  const client = createServerSupabaseClient();

  const { data, error } = await client.from("bots").select();
  if (error) {
    throw error;
  }

  const bots = data as [
    { id: number; name: string; description: string; user_id: string }
  ];
  console.log(bots);

  return (
    <div>
      <h1>Your bots</h1>

      <ul>
        {bots?.map((task) => (
          <li key={task.id}>
            <p>{task.name}</p>
            {/* <p>{task.description}</p> */}
          </li>
        ))}
      </ul>

      <AddTaskForm />
    </div>
  );
}

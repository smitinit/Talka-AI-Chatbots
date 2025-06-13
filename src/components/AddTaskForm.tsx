"use client";

import React, { useState } from "react";
import { addBot } from "@/lib/actions";
import { useRouter } from "next/navigation";

function AddTaskForm() {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  async function onSubmit() {
    await addBot(taskName, description);
    setTaskName("");
    router.refresh();
  }

  return (
    <form action={onSubmit}>
      <input
        autoFocus
        type="text"
        name="name"
        placeholder="Enter new name"
        onChange={(e) => setTaskName(e.target.value)}
        value={taskName}
        autoComplete="off"
      />
      <input
        autoFocus
        type="text"
        name="description"
        placeholder="Enter description"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        autoComplete="off"
      />
      <button type="submit">Create</button>
    </form>
  );
}
export default AddTaskForm;

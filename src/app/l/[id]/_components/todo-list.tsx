"use client";
import { client } from "@/lib/client";
import { useEffect } from "hono/jsx";
import { useWebSocket } from "jstack/client";
import { useState } from "react";

const socket = client.todoList.todoList.$ws();

socket.on("onConnect", () => {
  console.log("onConnect 1");
});

export function TodoList({ id }: { id: string }) {
  const [title, setTitle] = useState("");

  useWebSocket(socket, {
    titleChange: ({ title: newTitle }) => {
      console.log("title ws", title);
      setTitle(newTitle);
    },
  });

  function changeTitle(data: FormData) {
    const title = data.get("title");
    if (!title || typeof title !== "string") return;
    socket.emit("titleChange", {
      listId: id,
      title,
    });
  }

  return (
    <div>
      <h1>Todo List</h1>
      <h2>{title}</h2>
      <form action={changeTitle}>
        <input type="text" name="title" />
        <button type="submit">Change title</button>
      </form>
    </div>
  );
}

"use client";
import { client } from "@/lib/client";
import { useWebSocket } from "jstack/client";
import { useState, useEffect } from "react";

const socket = client.todoList.todoList.$ws();

socket.on("onConnect", () => {
  console.log("onConnect 1");
});

export function TodoList({ id }: { id: string }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    socket.emit("joinList", { listId: id });
  }, []);

  useWebSocket(socket, {
    titleChange: ({ title: newTitle }) => {
      console.log("title ws", newTitle);
      setTitle(newTitle);
    },
  });

  function changeTitle(newTitle: string) {
    socket.emit("titleChange", {
      listId: id,
      title: newTitle,
    });
  }

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          name="title"
          className="border-5"
          value={title}
          onChange={(e) => changeTitle(e.target.value)}
        />
      </div>
    </div>
  );
}

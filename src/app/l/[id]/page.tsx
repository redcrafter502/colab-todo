import { TodoList } from "./_components/todo-list";

export default async function ToDoListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <span>Todo List with id: {id}</span>
      <TodoList id={id} />
    </div>
  );
}

export default async function ToDoListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>Todo List with id: {id}</div>;
}

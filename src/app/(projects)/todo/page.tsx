import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { TodoBoard } from "~/app/_components/todo/board";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const { stages, todos, settings } = await api.todo.getBoard({ userId });

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl p-4">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Todo</h1>
      </div>
      <TodoBoard
        initialStages={stages}
        initialTodos={todos}
        initialSettings={settings}
        userId={userId}
      />
    </main>
  );
}

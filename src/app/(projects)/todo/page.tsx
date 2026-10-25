import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { TodoBoard } from "~/app/_components/todo/board";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const { stages, todos, settings } = await api.todo.getBoard();

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-primary mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
            Workspace / planning
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Todo board
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            Keep the next few things visible. Drag cards between stages or open
            one for more detail.
          </p>
        </div>
      </div>
      <TodoBoard
        initialStages={stages}
        initialTodos={todos}
        initialSettings={settings}
      />
    </main>
  );
}

import { Skeleton } from "~/app/_components/ui/skeleton";

export default function Loading() {
  return (
    <main aria-busy="true" className="mx-auto max-w-2xl p-4">
      <article className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
        <Skeleton className="h-56 w-full rounded-lg" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-6 h-32 w-full" />
      </article>
    </main>
  );
}

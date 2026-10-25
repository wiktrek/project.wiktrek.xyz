import { Skeleton } from "~/app/_components/ui/skeleton";

export default function Loading() {
  return (
    <main aria-busy="true" className="mx-auto max-w-2xl space-y-8 p-4">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <section className="bg-card space-y-3 rounded-xl border p-6 shadow-sm">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </section>
    </main>
  );
}

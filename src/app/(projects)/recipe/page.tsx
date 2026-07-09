import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import { api } from "~/trpc/server";

type RecipeRow = Awaited<ReturnType<typeof api.recipe.getAll>>[number];

function RecipeList({
  recipes,
  empty,
}: {
  recipes: RecipeRow[];
  empty: string;
}) {
  if (recipes.length === 0) {
    return <p className="text-muted-foreground text-sm">{empty}</p>;
  }

  return (
    <div className="space-y-2">
      {recipes.map((item) => (
        <Link
          key={item.id}
          href={`/recipe/${item.id}`}
          className="hover:bg-accent block rounded-lg border px-4 py-3 transition-colors"
        >
          <div className="flex items-start gap-3">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-16 w-20 shrink-0 rounded-md object-cover"
              />
            )}
            <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                {item.description && (
                  <p className="text-muted-foreground truncate text-sm">
                    {item.description}
                  </p>
                )}
              </div>
              <p className="shrink-0 text-sm font-medium">{item.rating}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function Page() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const topRecipes = await api.recipe.getAll();
  const myRecipes = email ? await api.recipe.getAllMY() : [];

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Recipes</h1>
        {email && (
          <Button asChild>
            <Link href="/recipe/create">Create recipe</Link>
          </Button>
        )}
      </header>

      <section className="bg-card space-y-3 rounded-xl border p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Top recipes</h2>
        <RecipeList recipes={topRecipes} empty="No recipes yet." />
      </section>

      {email && (
        <section className="bg-card space-y-3 rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">My recipes</h2>
          <RecipeList
            recipes={myRecipes}
            empty="You have not created recipes yet."
          />
        </section>
      )}
    </main>
  );
}

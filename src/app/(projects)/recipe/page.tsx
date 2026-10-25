import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import { api } from "~/trpc/server";

type RecipeRow = Awaited<ReturnType<typeof api.recipe.getAll>>[number];

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Quick meal",
];
const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Low-carb",
];

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
                <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-3 text-xs">
                  {item.category && <span>{item.category}</span>}
                  <span>{item.prepTimeMinutes + item.cookTimeMinutes} min</span>
                  <span>{item.difficulty}</span>
                </div>
              </div>
              <p className="shrink-0 text-sm font-medium">{item.rating}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const getParam = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const search = getParam("search") ?? "";
  const category = getParam("category") ?? "";
  const difficulty = getParam("difficulty") ?? "";
  const dietaryTag = getParam("dietaryTag") ?? "";
  const maxMinutes = Number(getParam("maxMinutes")) || undefined;
  const { userId } = await auth();
  const [topRecipes, myRecipes] = await Promise.all([
    api.recipe.getAll({ search, category, difficulty, dietaryTag, maxMinutes }),
    userId ? api.recipe.getAllMY().catch(() => null) : null,
  ]);
  // getAllMY rejects when the account has no email, same as the old check.
  const signedIn = myRecipes !== null;

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Recipes</h1>
        {signedIn && (
          <Button asChild>
            <Link href="/recipe/create">Create recipe</Link>
          </Button>
        )}
      </header>

      <form
        method="get"
        className="bg-card grid gap-3 rounded-xl border p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto_auto]"
      >
        <input
          name="search"
          defaultValue={search}
          placeholder="Search recipes or ingredients..."
          className="border-border/60 bg-muted/40 h-10 rounded-lg border px-3 text-sm"
        />
        <select
          name="category"
          defaultValue={category}
          className="border-border/60 bg-muted/40 h-10 rounded-lg border px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          name="maxMinutes"
          defaultValue={maxMinutes?.toString() ?? ""}
          className="border-border/60 bg-muted/40 h-10 rounded-lg border px-3 text-sm"
        >
          <option value="">Any cooking time</option>
          <option value="30">Under 30 min</option>
          <option value="60">Under 1 hour</option>
          <option value="120">Under 2 hours</option>
        </select>
        <select
          name="difficulty"
          defaultValue={difficulty}
          className="border-border/60 bg-muted/40 h-10 rounded-lg border px-3 text-sm"
        >
          <option value="">Any difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select
          name="dietaryTag"
          defaultValue={dietaryTag}
          className="border-border/60 bg-muted/40 h-10 rounded-lg border px-3 text-sm"
        >
          <option value="">Any diet</option>
          {dietaryOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <Button type="submit">Search</Button>
      </form>

      <section className="bg-card space-y-3 rounded-xl border p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          {search || category || difficulty || dietaryTag || maxMinutes
            ? "Matching recipes"
            : "Top recipes"}
        </h2>
        <RecipeList
          recipes={topRecipes}
          empty="No recipes match those filters."
        />
      </section>

      {signedIn && (
        <section className="bg-card space-y-3 rounded-xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold">My recipes</h2>
          <RecipeList
            recipes={myRecipes ?? []}
            empty="You have not created recipes yet."
          />
        </section>
      )}
    </main>
  );
}

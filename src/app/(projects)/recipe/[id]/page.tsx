import { notFound } from "next/navigation";
import { RecipeLikeButton } from "~/app/_components/recipeLikeButton";
import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    notFound();
  }

  const data = await api.recipe.getById({ id });

  if (!data) {
    notFound();
  }

  const { ingredients, instructions } = data;

  return (
    <main className="mx-auto max-w-2xl p-4">
      <article className="bg-card rounded-xl border p-6 shadow-sm">
        {data.imageUrl && (
          <img
            src={data.imageUrl}
            alt={data.name}
            className="mb-6 aspect-video w-full rounded-lg object-cover"
          />
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{data.name}</h1>
            {data.description && (
              <p className="text-muted-foreground">{data.description}</p>
            )}
            <p className="text-sm font-medium">Rating: {data.rating}</p>
            <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
              <span>
                {data.prepTimeMinutes + data.cookTimeMinutes} min total
              </span>
              <span>•</span>
              <span>{data.servings} servings</span>
              <span>•</span>
              <span>{data.difficulty}</span>
              {data.cuisine && (
                <>
                  <span>•</span>
                  <span>{data.cuisine}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {data.category && (
                <span className="rounded-full border px-2 py-1">
                  {data.category}
                </span>
              )}
              {data.dietaryTags.map((tag) => (
                <span key={tag} className="rounded-full border px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <RecipeLikeButton recipeId={data.id} />
        </div>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold">Ingredients</h2>
          <ul className="space-y-2">
            {ingredients.map((item, index) => (
              <li
                key={`${item.ingredient}-${index}`}
                className="rounded-lg border px-4 py-3"
              >
                <span className="font-medium">
                  {item.amount} {item.amountType}
                </span>{" "}
                {item.ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold">Instructions</h2>
          <ol className="list-decimal space-y-3 pl-5">
            {instructions.map((item, index) => (
              <li key={`${item.name}-${index}`} className="pl-1">
                <p className="wrap-break-words font-medium">{item.name}</p>
                <p className="text-muted-foreground wrap-break-words text-sm whitespace-pre-wrap">
                  {item.step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </main>
  );
}

import { notFound } from "next/navigation";
import { RecipeLikeButton } from "~/app/_components/recipeLikeButton";
import { api } from "~/trpc/server";
import type { recipeInputType } from "~/shared/recipe-validator";

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

  const ingredients = data.ingredients as recipeInputType["ingredients"];
  const instructions = data.instructions as recipeInputType["instructions"];

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
                  {item.amount} {"amountType" in item ? item.amountType : ""}
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
                <p className="font-medium wrap-break-words">{item.name}</p>
                <p className="text-muted-foreground text-sm wrap-break-words whitespace-pre-wrap">
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

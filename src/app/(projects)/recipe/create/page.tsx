"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { cn } from "~/app/_components/lib/utils";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Toaster } from "~/app/_components/ui/sonner";
import { Textarea } from "~/app/_components/ui/textarea";
import {
  type recipeInputType,
  recipeValidator,
} from "~/shared/recipe-validator";
import { api as trpc } from "~/trpc/react";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500">{message}</p>;
}

function isValidUrl(value?: string) {
  if (!value) return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const invalidFieldClass =
  "border-red-500/70 focus-visible:border-red-500 focus-visible:ring-red-500/40";

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

export default function Page() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<recipeInputType>({
    resolver: zodResolver(recipeValidator),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
      difficulty: "Easy",
      cuisine: "",
      category: "Dinner",
      dietaryTags: [],
      ingredients: [{ ingredient: "", amount: 1, amountType: "" }],
      instructions: [{ name: "", step: "" }],
    },
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    name: "instructions",
    control,
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: "ingredients",
    control,
  });

  const mutation = trpc.recipe.createRecipe.useMutation({
    onSuccess: (created) => {
      toast("Recipe created");
      router.push(`/recipe/${created.id}`);
    },
    onError: () => {
      toast("Failed to create recipe");
    },
  });
  const imageUrl = useWatch({ control, name: "imageUrl" });
  const showImagePreview = isValidUrl(imageUrl);
  const zodFieldErrors = mutation.error?.data?.zodError?.fieldErrors;
  const mutationMessages = zodFieldErrors
    ? Object.entries(zodFieldErrors).flatMap(([field, messages]) =>
        Array.isArray(messages)
          ? messages
              .filter(
                (message): message is string => typeof message === "string",
              )
              .map((message) => `${field}: ${message}`)
          : [],
      )
    : [];

  if (!isLoaded) {
    return <p className="p-4">Loading...</p>;
  }

  if (!isSignedIn || !user.primaryEmailAddress) {
    return <p className="p-4">Sign in to create recipes.</p>;
  }

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Create recipe</h1>
        <p className="text-muted-foreground">
          Add the details, ingredients, and steps for a recipe.
        </p>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit((data) => {
          mutation.mutate(data);
        })}
        className="space-y-6"
      >
        <section className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Details</h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Chocolate cake"
              aria-invalid={!!errors.name}
              className={cn(errors.name && invalidFieldClass)}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="A quick, rich dessert"
              aria-invalid={!!errors.description}
              className={cn(errors.description && invalidFieldClass)}
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              type="url"
              placeholder="https://example.com/chocolate-cake.jpg"
              aria-invalid={!!errors.imageUrl}
              className={cn(errors.imageUrl && invalidFieldClass)}
              {...register("imageUrl")}
            />
            <FieldError message={errors.imageUrl?.message} />
            {showImagePreview && (
              <img
                src={imageUrl}
                alt="Recipe preview"
                className="aspect-video w-full rounded-lg object-cover"
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prep time (min)</label>
              <Input
                type="number"
                min="0"
                {...register("prepTimeMinutes", { valueAsNumber: true })}
              />
              <FieldError message={errors.prepTimeMinutes?.message} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cook time (min)</label>
              <Input
                type="number"
                min="0"
                {...register("cookTimeMinutes", { valueAsNumber: true })}
              />
              <FieldError message={errors.cookTimeMinutes?.message} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Servings</label>
              <Input
                type="number"
                min="1"
                {...register("servings", { valueAsNumber: true })}
              />
              <FieldError message={errors.servings?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <select
                className="border-border/60 bg-muted/40 h-10 w-full rounded-lg border px-3 text-sm"
                {...register("difficulty")}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="border-border/60 bg-muted/40 h-10 w-full rounded-lg border px-3 text-sm"
                {...register("category")}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cuisine</label>
              <Input
                placeholder="Italian, Mexican..."
                {...register("cuisine")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dietary labels</label>
            <div className="flex flex-wrap gap-3">
              {dietaryOptions.map((tag) => (
                <label key={tag} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={tag}
                    {...register("dietaryTags")}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Ingredients</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendIngredient({ ingredient: "", amount: 1, amountType: "" })
              }
            >
              <Plus className="h-4 w-4" />
              Add ingredient
            </Button>
          </div>

          <div className="space-y-2">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="space-y-1">
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_7rem_7rem_auto]">
                  <Input
                    placeholder="Flour"
                    aria-invalid={!!errors.ingredients?.[index]?.ingredient}
                    className={cn(
                      errors.ingredients?.[index]?.ingredient &&
                        invalidFieldClass,
                    )}
                    {...register(`ingredients.${index}.ingredient`)}
                  />
                  <Input
                    type="number"
                    step="any"
                    placeholder="1"
                    aria-invalid={!!errors.ingredients?.[index]?.amount}
                    className={cn(
                      errors.ingredients?.[index]?.amount && invalidFieldClass,
                    )}
                    {...register(`ingredients.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    placeholder="cups"
                    aria-invalid={!!errors.ingredients?.[index]?.amountType}
                    className={cn(
                      errors.ingredients?.[index]?.amountType &&
                        invalidFieldClass,
                    )}
                    {...register(`ingredients.${index}.amountType`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    aria-label={`Remove ingredient ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <FieldError
                  message={errors.ingredients?.[index]?.ingredient?.message}
                />
                <FieldError
                  message={errors.ingredients?.[index]?.amount?.message}
                />
                <FieldError
                  message={errors.ingredients?.[index]?.amountType?.message}
                />
              </div>
            ))}
          </div>
          <FieldError message={errors.ingredients?.message} />
        </section>

        <section className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Instructions</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendInstruction({ step: "", name: "" })}
            >
              <Plus className="h-4 w-4" />
              Add step
            </Button>
          </div>

          <div className="space-y-2">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Step {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                    aria-label={`Remove step ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-start">
                  <Input
                    placeholder="Prep"
                    aria-invalid={!!errors.instructions?.[index]?.name}
                    className={cn(
                      "min-w-0",
                      errors.instructions?.[index]?.name && invalidFieldClass,
                    )}
                    {...register(`instructions.${index}.name`)}
                  />
                  <Textarea
                    aria-invalid={!!errors.instructions?.[index]?.step}
                    className={cn(
                      "wrap-break-words min-h-28 min-w-0 resize-y whitespace-pre-wrap",
                      errors.instructions?.[index]?.step && invalidFieldClass,
                    )}
                    placeholder="Mix the dry ingredients..."
                    {...register(`instructions.${index}.step`)}
                  />
                </div>
                <FieldError
                  message={errors.instructions?.[index]?.name?.message}
                />
                <FieldError
                  message={errors.instructions?.[index]?.step?.message}
                />
              </div>
            ))}
          </div>
          <FieldError message={errors.instructions?.message} />
        </section>

        {mutation.error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600">
            {mutationMessages.length > 0 ? (
              <ul className="space-y-1">
                {mutationMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : (
              <p>{mutation.error.message}</p>
            )}
          </div>
        )}

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Creating..." : "Create recipe"}
        </Button>
      </form>
      <Toaster />
    </main>
  );
}

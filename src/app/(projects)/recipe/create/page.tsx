"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "~/app/_components/ui/input";
import {
  type recipeInputType,
  recipeValidator,
} from "~/shared/recipe-validator";
import { api as trpc } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
const Page: NextPage = () => {
  // return <h1>I am too lazy to finish this</h1>
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<recipeInputType>({
    resolver: zodResolver(recipeValidator),
    defaultValues: {
      instructions: [{ name: "", step: "" }],
    },
  });
  const mutation = trpc.recipe.createRecipe.useMutation();
  watch("ingredients");
  watch("instructions");
  const { fields, append, remove } = useFieldArray<recipeInputType>({
    name: "instructions",
    control,
  });
  // const { fields, append, remove } = useFieldArray<recipeInputType>({
  //   name: "ingredients",
  //   control,
  // });
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) {
    return <p>Loading...</p>;
  }
  return (
    <main className="flex flex-col items-center justify-center text-center text-2xl">
      <div>
        <Link href="/recipe">recipe</Link>
      </div>
      <form
        onSubmit={handleSubmit((data) => {
          mutation.mutate({
            description: data.description,
            name: data.name,
            ingredients: data.ingredients,
            instructions: data.instructions,
            email: user.primaryEmailAddress!.emailAddress,
            recipe: 0,
          });
          reset();
        })}
        className="flex flex-col"
      >
        <label className="text-sm">name</label>
        <Input placeholder="name" className="rounded"></Input>
        <label className="text-sm">description</label>
        <Input placeholder="description" className="rounded"></Input>
        <label className="text-sm">Instructions</label>
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <section className="flex pt-1" key={field.id}>
                <Input
                  placeholder="Adding flour"
                  {...register(`instructions.${index}.name`)}
                ></Input>
                <Input
                  placeholder="Add flour..."
                  {...register(`instructions.${index}.step`, {
                    required: true,
                  })}
                />
                <button id="" type="button" onClick={() => remove(index)}>
                  X
                </button>
              </section>
            </div>
          );
        })}
        <button
          id=""
          type="button"
          onClick={() => {
            append({ step: "", name: "" });
          }}
        >
          add more instructions
        </button>
        {errors.ingredients && (
          <p id="error">{`${errors.ingredients?.message}`}</p>
        )}
        {errors.instructions && (
          <p id="error">{`${errors.instructions?.message}`}</p>
        )}
      </form>
    </main>
  );
};
export default Page;

"use client"
// import { NextApiRequest, NextApiResponse } from "next";
import { trpc } from "~/utils/trpc";
// import { type recipeType } from "~/server/routers/recipe";
import { useRouter } from "next/router";
import { useState } from "react"
export default function Page() {
  const router = useRouter();
  const id = Number(router.query.id);
  const { data, isLoading } = trpc.recipe.getById.useQuery({id});
  const [rating, setRating] = useState(data?.rating as number);
  const ratingMutation = trpc.recipe.changeRating.useMutation();
  if (!data || isLoading) {
    return <a>Loading...</a>
  }
  console.log(data.ingredients)
  function up() {
  if (!data || rating == data?.rating + 1) return
  ratingMutation.mutate({
    rating: data.rating + 1,
    id: data.id,
})
setRating(data.rating + 1)
  }
  function down() {
    if (!data || rating == data?.rating - 1) return
  ratingMutation.mutate({
    rating: data.rating - 1,
    id: data.id,
})
setRating(data.rating - 1)
  }
  return (
  <div className="justify-center items-center text-center text-2xl">
    <p>{data.name}</p>
    <p>{data.rating}</p>
    <p>
      <button onClick={up}>
        UP
      </button>
  
      </p>
    <p>
      <button onClick={down}>
      DOWN
      </button>
      
      </p>
    <p>{data.description}</p>
    {(data?.ingredients as Array<never>).map((ingredient: { ingredient: string, amount: number}) => {
      return (
      <p key={ingredient.ingredient}>{ingredient.ingredient}: {ingredient.amount}</p>
      )
    })}
    {(data?.directions as Array<never>).map((direction: { name: string, step: string, number: number}) => {
      return (
        <div key={direction.step}>
      <p className="text-4xl">{direction.number}.{direction.step}</p>
      <p className="text-2xl">{direction.step}</p>
        </div>

      )
    })}  
  </div>
  )
}
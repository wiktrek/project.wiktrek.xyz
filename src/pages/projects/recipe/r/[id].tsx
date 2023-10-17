"use client"
// import { NextApiRequest, NextApiResponse } from "next";
import { trpc } from "~/utils/trpc";
import { type recipeType } from "~/server/routers/recipe";
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
  <div className="justify-center items-center text-center">
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
    {JSON.parse(data?.ingredients as string).map((ingredient: { ingredient: string, amount: number}) => {
      return (
      <a key={ingredient.ingredient}>{ingredient.ingredient}: {ingredient.amount}</a>
      )
    })}  
  </div>
  )
}
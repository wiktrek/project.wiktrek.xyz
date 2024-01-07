"use client"
import { trpc } from "~/utils/trpc";
import { useAuth, useUser } from "@clerk/nextjs";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
// import { type recipeType } from "~/server/routers/recipe";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLong, faUpLong } from "@fortawesome/free-solid-svg-icons";
import { GetServerSideProps } from "next";
export default function Page() {
  const router = useRouter();
  const id = Number(router.query.id);
  const { data, isLoading } = trpc.recipe.getById.useQuery({id});
  const [rating, setRating] = useState(data?.rating|| 0);
  const [error, setError] = useState("");
  const ratingMutation = trpc.recipe.changeRating.useMutation();
  const { isSignedIn, user } = useUser()
  useEffect(() => {
    setRating(data?.rating as number)
  }, [data?.rating])
  if (!data || isLoading) {
    return <a>Loading...</a>
  }
console.log(data.ingredients)
function rate(value: number) {
  if (value < -1 || value > 1) return
   if (!isSignedIn) {
return setError("You have to be signed in to rate the recipe");
    }
    if (!data || rating == data?.rating + value) return
  ratingMutation.mutate({
    rating: data.rating + value,
    id: data.id,
})

setRating(data.rating + value)
}
  return (
  <div className="justify-center items-center text-center text-2xl">
    <p>{data.name}</p>
    <p className="space-x-1">
      <a>
        {rating} 
      </a>
      

      <button onClick={() => {
        rate(1)
      }}>
       <FontAwesomeIcon icon={faUpLong} />
      </button>
      <button onClick={() => {
        rate(-1)
      }}>
  <FontAwesomeIcon icon={faDownLong} />
      </button>
</p>
      <p className="text-red-700">{error}</p>
  
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
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
 
  if (!userId) {
    
  }
 
  // Load any data your application needs for the page using the userId
  return { props: { ...buildClerkProps(ctx.req) } };
};
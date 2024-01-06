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
  const ratingMutation = trpc.recipe.changeRating.useMutation();
  useEffect(() => {
    setRating(data?.rating as number)
  }, [data?.rating])
  if (!data || isLoading) {
    return <a>Loading...</a>
  }
  
  
  console.log(data.ingredients)
  function up() {
  if (!data || rating == data?.rating + 1) return
  ratingMutation.mutate({
    rating: data.rating + 1,
    id: data.id,
});
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
    <p className="space-x-1">
      <a>
        {rating} 
      </a>
      

      <button onClick={up}>
       <FontAwesomeIcon icon={faUpLong} />
      </button>
      <button onClick={down}>
  <FontAwesomeIcon icon={faDownLong} />
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
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
 
  if (!userId) {
    // handle user is not logged in.
  }
 
  // Load any data your application needs for the page using the userId
  return { props: { ...buildClerkProps(ctx.req) } };
};
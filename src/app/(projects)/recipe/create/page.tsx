import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { recipeInputType, recipeValidator } from "~/shared/recipe-validator";
const Page: NextPage = async () => {
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
    defaultValues: {},
  });
  return (
    <main className="flex items-center justify-center text-center text-2xl">
      <div>
        <Link href="/recipe">recipe</Link>
      </div>
    </main>
  );
};
export default Page;

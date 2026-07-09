import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { api } from "~/trpc/server";
import { UrlComponent } from "~/app/_components/urlComponent";
import { ClerkUser } from "~/app/_components/clerk";

const Page = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const data = await api.short.getAllLinks();
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <main className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl text-white">
      <ClerkUser />
      <UrlComponent data={data} />
    </main>
  );
};

export default Page;
export const metadata: Metadata = {
  title: "Link shortener - wiktrek.xyz",
  description: "Create short links",
};

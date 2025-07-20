import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { api } from "~/trpc/server";
import { UrlComponent } from "~/app/_components/urlComponent";
const Page = async () => {
  const { userId, redirectToSignIn } = await auth();
  const user = await currentUser();
  if (!userId || !user) return redirectToSignIn;
  const data = await api.short.getAllLinks({
    email: user?.primaryEmailAddress!.emailAddress,
  });
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <main className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl text-white">
      <UrlComponent
        email={user.primaryEmailAddress!.emailAddress}
        data={data}
      />
    </main>
  );
};

export default Page;
export const metadata: Metadata = {
  title: "Link shortener - wiktrek.xyz",
  description: "Create short links",
};

import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { LinkProfileClient } from "~/app/_components/linkComponent";
import { LinkDashboard } from "~/app/_components/linkDashboard";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const data = await api.link.getMyProfile();

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      {data ? (
        <LinkDashboard profile={data.profile} links={data.links} />
      ) : (
        <>
          <h1 className="text-xl font-semibold">Create your link page</h1>
          <p className="text-muted-foreground mt-1 mb-8 text-sm">
            All your links in one place.
          </p>
          <LinkProfileClient />
        </>
      )}
    </main>
  );
}

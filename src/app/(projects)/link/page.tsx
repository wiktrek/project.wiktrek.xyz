import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { LinkProfileClient } from "~/app/_components/linkComponent";
import { LinkDashboard } from "~/app/_components/linkDashboard";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const data = await api.link.getMyProfile();

  if (data) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center p-4">
        <LinkDashboard profile={data.profile} links={data.links} />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center p-4">
      <div className="bg-card w-full rounded-xl border p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Create your new link page. All your links in one place clean simple
        </h1>
        <LinkProfileClient />
      </div>
    </main>
  );
}

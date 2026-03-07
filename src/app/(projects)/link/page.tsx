import { auth, currentUser } from "@clerk/nextjs/server";
import { LinkProfileClient } from "~/app/_components/linkComponent";

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const user = await currentUser();
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex justify-center text-center, items-center flex-col">
      <h1>Create custom profile</h1>
      <LinkProfileClient userId={user.id} />
    </main>
  );
}
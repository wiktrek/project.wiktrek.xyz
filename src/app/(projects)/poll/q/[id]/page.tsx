/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionPageContent } from "~/app/_components/pollComponents";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const user = await currentUser();
  if (!id || typeof id !== "number") {
    return <div>No ID</div>;
  }
  const email = user?.primaryEmailAddress!.emailAddress ?? "no-email";
  return (
    <>
      <QuestionPageContent email={email} id={id} />
    </>
  );
}

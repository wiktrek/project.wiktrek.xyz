/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionPageContent } from "~/app/_components/pollComponents";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Toaster } from "~/app/_components/ui/sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  const user = await currentUser();
  if (!id || typeof id !== "number") {
    return <div>No ID</div>;
  }
  const email = user?.primaryEmailAddress!.emailAddress ?? "no-email";
  return (
    <>
      <QuestionPageContent email={email} id={id} />
      <Toaster />
    </>
  );
}
export const metadata: Metadata = {
  title: "Poll - wiktrek.xyz",
  description: "Create polls",
};

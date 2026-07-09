/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionPageContent } from "~/app/_components/pollComponents";
import type { Metadata } from "next";
import { Toaster } from "~/app/_components/ui/sonner";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!id || typeof id !== "number") {
    return <div>No ID</div>;
  }
  return (
    <>
      <QuestionPageContent id={id} />
      <Toaster />
    </>
  );
}
export const metadata: Metadata = {
  title: "Poll - wiktrek.xyz",
  description: "Create polls",
};

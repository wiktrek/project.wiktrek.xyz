"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/app/_components/ui/button";
import { api } from "~/trpc/react";

export function RecipeLikeButton({ recipeId }: { recipeId: number }) {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const mutation = api.recipe.like.useMutation({
    onSuccess: () => router.refresh(),
  });

  const disabled = !isSignedIn || mutation.isPending;

  const vote = (up: boolean) => {
    if (!isSignedIn) return;
    mutation.mutate({ id: recipeId, up });
  };

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => vote(true)}
      >
        Like
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => vote(false)}
      >
        Dislike
      </Button>
    </div>
  );
}

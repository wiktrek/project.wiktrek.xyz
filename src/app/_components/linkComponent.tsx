"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import { api } from "~/trpc/react";

const createSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, hyphens, underscores"),
  displayName: z.string().max(100).optional(),
});

export type CreateData = z.infer<typeof createSchema>;

export function LinkProfileClient() {
  const router = useRouter();
  const mutation = api.link.createProfile.useMutation({
    onSuccess: () => {
      toast("Profile created");
      router.refresh();
    },
    onError: () => toast("Could not create profile. Try another username."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateData>({
    resolver: zodResolver(createSchema),
  });

  const onSubmit = (data: CreateData) =>
    mutation.mutate({
      username: data.username,
      displayName: data.displayName || undefined,
    });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1">
          <div className="border-border/60 bg-muted/40 hover:border-border focus-within:border-primary focus-within:ring-primary/40 flex h-10 items-center rounded-lg border pl-3.5 transition-colors focus-within:ring-1">
            <span className="text-muted-foreground text-sm">/link/</span>
            <input
              placeholder="username"
              autoFocus
              {...register("username")}
              disabled={mutation.isPending}
              className="placeholder:text-muted-foreground/70 h-full w-full bg-transparent pr-3.5 text-base outline-none disabled:opacity-50 md:text-sm"
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>
        <Input
          placeholder="Display name (optional)"
          {...register("displayName")}
          disabled={mutation.isPending}
        />
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
      <Toaster />
    </>
  );
}

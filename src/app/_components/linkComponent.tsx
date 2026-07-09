"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    .regex(/^[a-zA-Z0-9_-]+$/),
  displayName: z.string().max(100).optional(),
});

export type CreateData = z.infer<typeof createSchema>;

interface CreateFormProps {
  onSubmit: (data: CreateData) => void | Promise<void>;
  isLoading?: boolean;
}

function CreateForm({ onSubmit, isLoading }: CreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateData>({
    resolver: zodResolver(createSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username <span className="text-red-500">*</span>
        </label>
        <Input
          id="username"
          placeholder="your-username"
          {...register("username")}
          disabled={isLoading || isSubmitting}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="displayName"
          placeholder="Your Name"
          {...register("displayName")}
          disabled={isLoading || isSubmitting}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="w-full"
      >
        {isLoading || isSubmitting ? "Creating..." : "Create Profile"}
      </Button>
    </form>
  );
}

export function LinkProfileClient() {
  const mutation = api.link.createProfile.useMutation();

  return (
    <>
      <CreateForm
        isLoading={mutation.isPending}
        onSubmit={(data) => {
          mutation.mutate(
            { username: data.username, displayName: data.displayName },
            { onSuccess: () => toast("Created profile!") },
          );
        }}
      />
      <Toaster />
    </>
  );
}

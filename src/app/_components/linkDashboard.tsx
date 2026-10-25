"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Copy, X } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Toaster } from "./ui/sonner";
import { api } from "~/trpc/react";
import type { link, linkProfile } from "~/server/db/schema";

type Profile = typeof linkProfile.$inferSelect;
type Link = typeof link.$inferSelect;

const profileSchema = z.object({
  displayName: z.string().max(100).optional(),
  username: z
    .string()
    .min(1, "Required")
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, hyphens, underscores"),
  bio: z.string().max(500).optional(),
  slug: z
    .string()
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, hyphens, underscores")
    .optional(),
});

const linkSchema = z.object({
  title: z.string().min(1, "Required").max(100),
  url: z
    .string()
    .url("Invalid URL")
    .max(1000)
    .refine(
      (value) => {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      },
      { message: "URL must start with http:// or https://" },
    ),
});

export function LinkDashboard({
  profile,
  links,
}: {
  profile: Profile;
  links: Link[];
}) {
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const publicUrl = `/link/${profile.slug ?? profile.username}`;

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName ?? "",
      username: profile.username,
      bio: profile.bio ?? "",
      slug: profile.slug ?? "",
    },
  });

  const updateProfile = api.link.updateProfile.useMutation({
    onSuccess: () => {
      toast("Profile updated");
      setEditing(false);
      router.refresh();
    },
  });

  const createLink = api.link.createLink.useMutation({
    onSuccess: () => {
      toast("Link added");
      router.refresh();
    },
  });

  const deleteLink = api.link.deleteLink.useMutation({
    onSuccess: () => {
      toast("Link deleted");
      router.refresh();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
  });

  const onSubmit = async (data: z.infer<typeof linkSchema>) => {
    createLink.mutate(data, { onSuccess: () => reset() });
  };

  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfile.mutate({
      displayName: data.displayName || undefined,
      username: data.username,
      bio: data.bio || undefined,
      slug: data.slug || undefined,
    });
  };

  const copyProfileUrl = async () => {
    const url = `${window.location.origin}${publicUrl}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Profile URL copied");
    } catch {
      toast("Could not copy profile URL");
    }
  };

  const setProfileDialogOpen = (open: boolean) => {
    setEditing(open);
    if (!open) profileForm.reset();
  };

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold">
            {profile.displayName || `@${profile.username}`}
          </h1>
          <a
            href={publicUrl}
            className="text-muted-foreground hover:text-foreground text-sm underline-offset-2 hover:underline"
          >
            {publicUrl}
          </a>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyProfileUrl}
            aria-label="Copy profile URL"
          >
            <Copy />
          </Button>
          <Dialog open={editing} onOpenChange={setProfileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Update how your public link page appears.
                </DialogDescription>
              </DialogHeader>
              <form
                id="edit-link-profile"
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-3"
              >
                <Input
                  {...profileForm.register("displayName")}
                  placeholder="Display name"
                />
                <div className="space-y-1">
                  <Input
                    {...profileForm.register("username")}
                    placeholder="Username"
                  />
                  {profileForm.formState.errors.username && (
                    <p className="text-xs text-red-500">
                      {profileForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <Textarea
                  {...profileForm.register("bio")}
                  placeholder="Bio"
                  rows={3}
                />
                <div className="space-y-1">
                  <Input
                    {...profileForm.register("slug")}
                    placeholder="Slug (URL path)"
                  />
                  {profileForm.formState.errors.slug && (
                    <p className="text-xs text-red-500">
                      {profileForm.formState.errors.slug.message}
                    </p>
                  )}
                </div>
              </form>
              <DialogFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProfileDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="edit-link-profile"
                  size="sm"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {links.length === 0 ? (
          <p className="text-muted-foreground text-sm">No links yet.</p>
        ) : (
          <ul className="divide-y">
            {links.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.title}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {l.url}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLink.mutate({ linkId: l.id })}
                  disabled={deleteLink.isPending}
                  aria-label={`Delete ${l.title}`}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Title"
              {...register("title")}
              disabled={isSubmitting}
              className="sm:w-2/5"
            />
            <Input
              placeholder="https://..."
              {...register("url")}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={createLink.isPending}
              className="shrink-0"
            >
              {createLink.isPending ? "Adding..." : "Add"}
            </Button>
          </div>
          {(errors.title ?? errors.url) && (
            <p className="text-xs text-red-500">
              {errors.title?.message ?? errors.url?.message}
            </p>
          )}
        </form>
      </div>

      <Toaster />
    </div>
  );
}

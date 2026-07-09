"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
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

  return (
    <div className="bg-card w-full max-w-xl rounded-xl border p-6 shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h2 className="truncate text-xl font-semibold">
              {profile.displayName || `@${profile.username}`}
            </h2>
            {profile.displayName && (
              <p className="text-muted-foreground text-sm">
                @{profile.username}
              </p>
            )}
            <a
              href={publicUrl}
              className="text-muted-foreground hover:text-foreground inline-block text-xs underline underline-offset-2"
            >
              {publicUrl}
            </a>
          </div>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          )}
        </div>

        {editing ? (
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input
                {...profileForm.register("displayName")}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                {...profileForm.register("username")}
                placeholder="username"
              />
              {profileForm.formState.errors.username && (
                <p className="text-xs text-red-500">
                  {profileForm.formState.errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                {...profileForm.register("bio")}
                placeholder="Tell people about yourself..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input {...profileForm.register("slug")} placeholder="url-path" />
              <p className="text-muted-foreground text-xs">
                Current public URL: /link/{profile.slug ?? profile.username}
              </p>
              {profileForm.formState.errors.slug && (
                <p className="text-xs text-red-500">
                  {profileForm.formState.errors.slug.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  profileForm.reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          profile.bio && (
            <p className="text-muted-foreground text-sm">{profile.bio}</p>
          )
        )}

        <div className="border-t pt-6">
          <h2 className="mb-4 text-lg font-semibold">
            Links
            {links.length > 0 && (
              <span className="text-muted-foreground ml-1 text-sm font-normal">
                ({links.length})
              </span>
            )}
          </h2>

          {links.length > 0 && (
            <ul className="mb-4 space-y-2">
              {links.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{l.title}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {l.url}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLink.mutate({ linkId: l.id })}
                    disabled={deleteLink.isPending}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Input
                placeholder="Title"
                {...register("title")}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Input
                placeholder="https://..."
                {...register("url")}
                disabled={isSubmitting}
              />
              {errors.url && (
                <p className="text-xs text-red-500">{errors.url.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={createLink.isPending}
              className="w-full"
            >
              {createLink.isPending ? "Adding..." : "Add link"}
            </Button>
          </form>
        </div>

        <Toaster />
      </div>
    </div>
  );
}

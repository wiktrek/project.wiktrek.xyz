"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import { api } from "~/trpc/react";

// Zod schema matching the linkProfile database schema
const createLinkProfileSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be 50 characters or less")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores",
    ),
  displayName: z
    .string()
    .max(100, "Display name must be 100 characters or less")
    .optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  avatarUrl: z
    .string()
    .url("Must be a valid URL")
    .max(500, "Avatar URL must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  backgroundColor: z
    .string()
    .max(20, "Background color must be 20 characters or less")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g., #ffffff)")
    .optional(),
  textColor: z
    .string()
    .max(20, "Text color must be 20 characters or less")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g., #000000)")
    .optional(),
  buttonStyle: z
    .enum(["rounded", "square", "pill"])
    .optional(),
  isPublic: z.boolean().optional(),
});

export type CreateLinkProfileInput = z.infer<typeof createLinkProfileSchema>;

// Type with required defaults for submission
export type CreateLinkProfileData = Required<
  Pick<
    CreateLinkProfileInput,
    "username" | "backgroundColor" | "textColor" | "buttonStyle" | "isPublic"
  >
> &
  Pick<CreateLinkProfileInput, "displayName" | "bio" | "avatarUrl">;

interface CreateLinkProfileFormProps {
  onSubmit: (data: CreateLinkProfileData) => void | Promise<void>;
  defaultValues?: Partial<CreateLinkProfileInput>;
  isLoading?: boolean;
}

export function CreateLinkProfileForm({
  onSubmit,
  defaultValues,
  isLoading = false,
}: CreateLinkProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateLinkProfileInput>({
    resolver: zodResolver(createLinkProfileSchema),
    defaultValues: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      buttonStyle: "rounded",
      isPublic: true,
      ...defaultValues,
    },
  });

  const backgroundColor = watch("backgroundColor") ?? "#ffffff";
  const textColor = watch("textColor") ?? "#000000";
  const buttonStyle = watch("buttonStyle") ?? "rounded";

  const handleFormSubmit = async (data: CreateLinkProfileInput) => {
    // Apply defaults before submitting
    const dataWithDefaults: CreateLinkProfileData = {
      username: data.username,
      displayName: data.displayName,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      backgroundColor: data.backgroundColor ?? "#ffffff",
      textColor: data.textColor ?? "#000000",
      buttonStyle: data.buttonStyle ?? "rounded",
      isPublic: data.isPublic ?? true,
    };
    await onSubmit(dataWithDefaults);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Username */}
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

        {/* Display Name */}
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            Display Name
          </label>
          <Input
            id="displayName"
            placeholder="Your Display Name"
            {...register("displayName")}
            disabled={isLoading || isSubmitting}
          />
          {errors.displayName && (
            <p className="text-sm text-red-500">{errors.displayName.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <Textarea
            id="bio"
            placeholder="Tell people about yourself..."
            rows={4}
            {...register("bio")}
            disabled={isLoading || isSubmitting}
          />
          {errors.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        {/* Avatar URL */}
        <div className="space-y-2">
          <label htmlFor="avatarUrl" className="text-sm font-medium">
            Avatar URL
          </label>
          <Input
            id="avatarUrl"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            {...register("avatarUrl")}
            disabled={isLoading || isSubmitting}
          />
          {errors.avatarUrl && (
            <p className="text-sm text-red-500">{errors.avatarUrl.message}</p>
          )}
        </div>

        {/* Customization Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Customization</h3>

          {/* Background Color */}
          <div className="space-y-2">
            <label htmlFor="backgroundColor" className="text-sm font-medium">
              Background Color
            </label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                {...register("backgroundColor")}
                disabled={isLoading || isSubmitting}
                className="h-10 w-20"
              />
              <Input
                type="text"
                value={backgroundColor}
                {...register("backgroundColor")}
                disabled={isLoading || isSubmitting}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
            {errors.backgroundColor && (
              <p className="text-sm text-red-500">
                {errors.backgroundColor.message}
              </p>
            )}
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <label htmlFor="textColor" className="text-sm font-medium">
              Text Color
            </label>
            <div className="flex gap-2">
              <Input
                id="textColor"
                type="color"
                {...register("textColor")}
                disabled={isLoading || isSubmitting}
                className="h-10 w-20"
              />
              <Input
                type="text"
                value={textColor}
                {...register("textColor")}
                disabled={isLoading || isSubmitting}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
            {errors.textColor && (
              <p className="text-sm text-red-500">{errors.textColor.message}</p>
            )}
          </div>

          {/* Button Style */}
          <div className="space-y-2">
            <label htmlFor="buttonStyle" className="text-sm font-medium">
              Button Style
            </label>
            <select
              id="buttonStyle"
              {...register("buttonStyle")}
              disabled={isLoading || isSubmitting}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="rounded">Rounded</option>
              <option value="square">Square</option>
              <option value="pill">Pill</option>
            </select>
            {errors.buttonStyle && (
              <p className="text-sm text-red-500">
                {errors.buttonStyle.message}
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview</label>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: backgroundColor }}
            >
              <button
                type="button"
                disabled
                style={{
                  backgroundColor: textColor,
                  color: backgroundColor,
                  borderRadius:
                    buttonStyle === "pill"
                      ? "9999px"
                      : buttonStyle === "square"
                        ? "0"
                        : "0.375rem",
                }}
                className="w-full px-4 py-2 text-sm font-medium"
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>

        {/* Is Public */}
        <div className="flex items-center space-x-2">
          <input
            id="isPublic"
            type="checkbox"
            {...register("isPublic")}
            disabled={isLoading || isSubmitting}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="isPublic" className="text-sm font-medium">
            Make profile public
          </label>
        </div>
        {errors.isPublic && (
          <p className="text-sm text-red-500">{errors.isPublic.message}</p>
        )}
      </div>

      {/* Submit Button */}
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

type LinkProfileClientProps = {
  userId: string;
};

export function LinkProfileClient({ userId }: LinkProfileClientProps) {
  const mutation = api.link.createProfile.useMutation();

  return (
    <>
      <CreateLinkProfileForm
        isLoading={mutation.isPending}
        onSubmit={(o) => {
          mutation.mutate(
            {
              userId,
              username: o.username,
              displayName: o.displayName,
              avatarUrl: o.avatarUrl,
              backgroundColor: o.backgroundColor,
              bio: o.bio,
              buttonStyle: o.buttonStyle,
              isPublic: o.isPublic,
              textColor: o.textColor,
            },
            {
              onSuccess: () => toast("Created profile!"),
            },
          );
        }}
      />
      <Toaster />
    </>
  );
}

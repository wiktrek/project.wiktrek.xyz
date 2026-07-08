import type { DoneRetention } from "~/server/api/routers/todo";

export const todoStageColors: Record<string, string> = {
  orange: "bg-orange-500/25 text-orange-700 dark:text-orange-300",
  yellow: "bg-yellow-500/25 text-yellow-700 dark:text-yellow-300",
  rose: "bg-rose-500/25 text-rose-700 dark:text-rose-300",
  green: "bg-green-500/25 text-green-700 dark:text-green-300",
  blue: "bg-blue-500/25 text-blue-700 dark:text-blue-300",
  purple: "bg-purple-500/25 text-purple-700 dark:text-purple-300",
  gray: "bg-gray-500/25 text-gray-700 dark:text-gray-300",
};

export const todoRetentionOptions: { value: DoneRetention; label: string }[] = [
  { value: "1d", label: "1 day" },
  { value: "1w", label: "1 week" },
  { value: "1m", label: "1 month" },
  { value: "1y", label: "1 year" },
  { value: "never", label: "Never" },
];

export function parseTodoDraft(draft: string) {
  const tags: string[] = [];
  const title = draft
    .replace(/#(\S+)/g, (_, tag: string) => {
      tags.push(tag);
      return "";
    })
    .replace(/\s+/g, " ")
    .trim();

  return { title, tags };
}

export function sortTodoItems<T extends { id: number; order: number }>(
  items: T[],
) {
  return [...items].sort((a, b) => a.order - b.order || a.id - b.id);
}

function coerceDate(date: Date | string | null) {
  if (!date) return null;
  return date instanceof Date ? date : new Date(date);
}

export function formatTodoDate(date: Date | string | null) {
  const value = coerceDate(date);
  if (!value || Number.isNaN(value.getTime())) return "No date";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function toDateInputValue(date: Date | string | null) {
  const value = coerceDate(date);
  if (!value || Number.isNaN(value.getTime())) return "";
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

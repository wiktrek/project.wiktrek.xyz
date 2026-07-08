"use client";

import { Save, Settings } from "lucide-react";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Textarea } from "~/app/_components/ui/textarea";
import {
  formatTodoDate,
  todoRetentionOptions,
} from "~/app/_components/lib/todo";
import type { DoneRetention } from "~/server/api/routers/todo";

export type TodoDetail = {
  id: number | null;
  title: string;
  description: string;
  date: string;
};

export function SettingsDialog({
  retention,
  onChange,
}: {
  retention: DoneRetention;
  onChange: (value: DoneRetention) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Todo settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Delete todos in Done stages after
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {todoRetentionOptions.map((option) => (
            <Button
              key={option.value}
              variant={retention === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DetailDialog({
  detail,
  saving,
  setDetail,
  onClose,
  onSave,
}: {
  detail: TodoDetail;
  saving: boolean;
  setDetail: (detail: TodoDetail) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog
      open={detail.id !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Todo details</DialogTitle>
          <DialogDescription>
            {detail.id !== null
              ? `Date ${formatTodoDate(detail.date ? new Date(detail.date) : null)}`
              : "Edit this todo"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="space-y-1.5 text-sm font-medium">
            <span>Title</span>
            <Input
              value={detail.title}
              onChange={(e) => setDetail({ ...detail, title: e.target.value })}
              maxLength={500}
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            <span>Date</span>
            <Input
              type="datetime-local"
              value={detail.date}
              onChange={(e) => setDetail({ ...detail, date: e.target.value })}
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            <span>Description</span>
            <Textarea
              value={detail.description}
              onChange={(e) =>
                setDetail({ ...detail, description: e.target.value })
              }
              maxLength={5000}
              placeholder="Add a description"
              className="min-h-32"
            />
          </label>
        </div>
        <DialogFooter>
          <Button onClick={onSave} disabled={saving}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

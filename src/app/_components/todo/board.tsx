"use client";

import { useState, type KeyboardEvent } from "react";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "~/app/_components/ui/sonner";
import { cn } from "~/app/_components/lib/utils";
import {
  parseTodoDraft,
  sortTodoItems,
  toDateInputValue,
  todoStageColors,
} from "~/app/_components/lib/todo";
import { DetailDialog, SettingsDialog, type TodoDetail } from "./dialogs";
import { api } from "~/trpc/react";
import type { DoneRetention } from "~/server/api/routers/todo";
import type { todo, todoSettings, todoStage } from "~/server/db/schema";

type Todo = typeof todo.$inferSelect;
type Stage = typeof todoStage.$inferSelect;
type TodoSettings = typeof todoSettings.$inferSelect;
type CardDrag = {
  id: number | null;
  over: { stageId: number; index: number } | null;
};
type StageDrag = { id: number | null; over: number | null };
type TodoMenu = { id: number; x: number; y: number } | null;

const emptyCardDrag: CardDrag = { id: null, over: null };
const emptyStageDrag: StageDrag = { id: null, over: null };
const emptyDetail: TodoDetail = {
  id: null,
  title: "",
  description: "",
  date: "",
};

function stageOrderForDrag(stages: Stage[], drag: StageDrag) {
  if (drag.id === null || drag.over === null) return stages;

  const from = stages.findIndex((stage) => stage.id === drag.id);
  if (from === -1) return stages;

  let to = Math.max(0, Math.min(drag.over, stages.length));
  if (from < to) to--;

  const reordered = stages.filter((stage) => stage.id !== drag.id);
  reordered.splice(to, 0, stages[from]!);
  return reordered;
}

export function TodoBoard({
  initialStages,
  initialTodos,
  initialSettings,
}: {
  initialStages: Stage[];
  initialTodos: Todo[];
  initialSettings: TodoSettings;
}) {
  const [stages, setStages] = useState(initialStages);
  const [items, setItems] = useState(initialTodos);
  const [retention, setRetention] = useState<DoneRetention>(
    initialSettings.doneRetention as DoneRetention,
  );
  const [cardDrag, setCardDrag] = useState<CardDrag>(emptyCardDrag);
  const [stageDrag, setStageDrag] = useState<StageDrag>(emptyStageDrag);
  const [detail, setDetail] = useState<TodoDetail>(emptyDetail);
  const [menu, setMenu] = useState<TodoMenu>(null);
  const [newStage, setNewStage] = useState({ open: false, name: "" });

  const onError = (error: { message: string }) => toast(error.message);
  const createTodo = api.todo.create.useMutation({
    onSuccess: (created) => setItems((prev) => [...prev, created]),
    onError,
  });
  const moveTodo = api.todo.move.useMutation({ onError });
  const updateTodo = api.todo.update.useMutation({ onError });
  const deleteTodo = api.todo.delete.useMutation({ onError });
  const createStage = api.todo.createStage.useMutation({
    onSuccess: (created) => setStages((prev) => [...prev, created]),
    onError,
  });
  const renameStage = api.todo.renameStage.useMutation({ onError });
  const deleteStage = api.todo.deleteStage.useMutation({ onError });
  const moveStage = api.todo.moveStage.useMutation({ onError });
  const updateSettings = api.todo.updateSettings.useMutation({
    onSuccess: () => toast("Settings saved"),
    onError,
  });

  const orderedStages = sortTodoItems(stages);
  const previewStages = stageOrderForDrag(orderedStages, stageDrag);
  const stageItems = (stageId: number) =>
    sortTodoItems(items.filter((item) => item.stageId === stageId));

  function createTodoFromDraft(stageId: number, draft: string) {
    const { title, tags } = parseTodoDraft(draft);
    if (!title) return false;
    createTodo.mutate({ title, stageId, tags });
    return true;
  }

  function dropCard(stageId: number) {
    if (cardDrag.id === null || cardDrag.over?.stageId !== stageId) return;
    const dragged = items.find((item) => item.id === cardDrag.id);
    if (!dragged) return;

    const column = stageItems(stageId);
    let index = cardDrag.over.index;
    const currentIndex = column.findIndex((item) => item.id === cardDrag.id);
    if (currentIndex !== -1 && currentIndex < index) index--;

    const reordered = column.filter((item) => item.id !== cardDrag.id);
    reordered.splice(index, 0, { ...dragged, stageId });

    setItems((prev) => [
      ...prev.filter(
        (item) => item.id !== cardDrag.id && item.stageId !== stageId,
      ),
      ...reordered.map((item, order) => ({ ...item, order })),
    ]);
    moveTodo.mutate({
      id: cardDrag.id,
      stageId,
      orderedIds: reordered.map((item) => item.id),
    });
  }

  function dropStage() {
    if (stageDrag.id === null || stageDrag.over === null) return;
    const next = stageOrderForDrag(orderedStages, stageDrag).map(
      (stage, order) => ({ ...stage, order }),
    );

    setStages(next);
    moveStage.mutate({ orderedIds: next.map((stage) => stage.id) });
  }

  function saveDetail() {
    if (detail.id === null) return;
    const title = detail.title.trim();
    if (!title) return toast("Title is required");
    if (!detail.date) return toast("Date is required");

    const date = new Date(detail.date);
    if (Number.isNaN(date.getTime())) return toast("Date is invalid");

    const description = detail.description.trim();
    setItems((prev) =>
      prev.map((item) =>
        item.id === detail.id ? { ...item, title, description, date } : item,
      ),
    );
    updateTodo.mutate({ id: detail.id, title, description, date });
    setDetail(emptyDetail);
  }

  function deleteTodoById(id: number) {
    setMenu(null);
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (detail.id === id) setDetail(emptyDetail);
    deleteTodo.mutate({ id });
  }

  function submitNewStage() {
    const name = newStage.name.trim();
    setNewStage({ open: false, name: "" });
    if (!name) return;
    createStage.mutate({ name });
  }

  return (
    <div onClick={() => setMenu(null)}>
      <div className="mb-2 flex justify-end">
        <SettingsDialog
          retention={retention}
          onChange={(doneRetention) => {
            setRetention(doneRetention);
            updateSettings.mutate({ doneRetention });
          }}
        />
      </div>

      <div className="flex flex-wrap items-start gap-4 pb-4">
        {previewStages.map((stage, index) => (
          <div key={stage.id} className="flex items-stretch gap-2">
            <StageColumn
              stage={stage}
              index={index}
              cards={stageItems(stage.id)}
              cardDrag={cardDrag}
              stageDragId={stageDrag.id}
              onAddTodo={createTodoFromDraft}
              onRenameStage={(name) => {
                setStages((prev) =>
                  prev.map((item) =>
                    item.id === stage.id ? { ...item, name } : item,
                  ),
                );
                renameStage.mutate({ id: stage.id, name });
              }}
              onDeleteStage={() => {
                setStages((prev) =>
                  prev.filter((item) => item.id !== stage.id),
                );
                deleteStage.mutate({ id: stage.id });
              }}
              onOpenTodo={(card) => {
                setMenu(null);
                setDetail({
                  id: card.id,
                  title: card.title,
                  description: card.description ?? "",
                  date: toDateInputValue(card.date),
                });
              }}
              onTodoMenu={(card, x, y) => setMenu({ id: card.id, x, y })}
              onDeleteTodo={deleteTodoById}
              onCardDragStart={(id) => {
                setMenu(null);
                setCardDrag({ id, over: null });
              }}
              onCardDragOver={(stageId, cardIndex) =>
                setCardDrag((current) => ({
                  ...current,
                  over: { stageId, index: cardIndex },
                }))
              }
              onCardDrop={(stageId) => {
                dropCard(stageId);
                setCardDrag(emptyCardDrag);
              }}
              onCardDragEnd={() => setCardDrag(emptyCardDrag)}
              onStageDragStart={() => {
                setMenu(null);
                setStageDrag({ id: stage.id, over: index });
              }}
              onStageDragOver={(over) =>
                setStageDrag((current) => ({ ...current, over }))
              }
              onStageDrop={() => {
                dropStage();
                setStageDrag(emptyStageDrag);
              }}
              onStageDragEnd={() => setStageDrag(emptyStageDrag)}
            />
          </div>
        ))}

        <div className="w-56 shrink-0">
          {newStage.open ? (
            <input
              autoFocus
              value={newStage.name}
              onChange={(e) =>
                setNewStage({ open: true, name: e.target.value })
              }
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") submitNewStage();
                if (e.key === "Escape") setNewStage({ open: false, name: "" });
              }}
              onBlur={submitNewStage}
              placeholder="Stage name"
              className="bg-card focus-visible:ring-ring w-full rounded-lg border p-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
            />
          ) : (
            <button
              onClick={() => setNewStage({ open: true, name: "" })}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-lg border border-dashed p-3 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" /> Add stage
            </button>
          )}
        </div>
      </div>

      {menu && (
        <div
          className="bg-popover text-popover-foreground fixed z-50 w-44 rounded-md border p-1 shadow-md"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="hover:bg-accent text-destructive flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm"
            onClick={() => deleteTodoById(menu.id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
      <DetailDialog
        detail={detail}
        saving={updateTodo.isPending}
        setDetail={setDetail}
        onClose={() => setDetail(emptyDetail)}
        onSave={saveDetail}
      />
      <Toaster />
    </div>
  );
}

function StageColumn({
  stage,
  index,
  cards,
  cardDrag,
  stageDragId,
  onAddTodo,
  onRenameStage,
  onDeleteStage,
  onOpenTodo,
  onTodoMenu,
  onDeleteTodo,
  onCardDragStart,
  onCardDragOver,
  onCardDrop,
  onCardDragEnd,
  onStageDragStart,
  onStageDragOver,
  onStageDrop,
  onStageDragEnd,
}: {
  stage: Stage;
  index: number;
  cards: Todo[];
  cardDrag: CardDrag;
  stageDragId: number | null;
  onAddTodo: (stageId: number, draft: string) => boolean;
  onRenameStage: (name: string) => void;
  onDeleteStage: () => void;
  onOpenTodo: (card: Todo) => void;
  onTodoMenu: (card: Todo, x: number, y: number) => void;
  onDeleteTodo: (id: number) => void;
  onCardDragStart: (id: number) => void;
  onCardDragOver: (stageId: number, index: number) => void;
  onCardDrop: (stageId: number) => void;
  onCardDragEnd: () => void;
  onStageDragStart: () => void;
  onStageDragOver: (index: number) => void;
  onStageDrop: () => void;
  onStageDragEnd: () => void;
}) {
  const [todoDraft, setTodoDraft] = useState({ open: false, value: "" });
  const [stageDraft, setStageDraft] = useState({ open: false, value: "" });

  function submitTodo() {
    if (onAddTodo(stage.id, todoDraft.value)) {
      setTodoDraft({ open: false, value: "" });
    }
  }

  function submitStage() {
    const name = stageDraft.value.trim();
    setStageDraft({ open: false, value: "" });
    if (name && name !== stage.name) onRenameStage(name);
  }

  return (
    <div
      className={cn(
        "bg-muted/40 flex w-72 shrink-0 flex-col gap-2 rounded-lg p-2",
        stageDragId === stage.id && "opacity-40",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        if (stageDragId !== null) {
          const rect = e.currentTarget.getBoundingClientRect();
          onStageDragOver(
            e.clientX < rect.left + rect.width / 2 ? index : index + 1,
          );
        } else if (cardDrag.id !== null) {
          onCardDragOver(stage.id, cards.length);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (stageDragId !== null) onStageDrop();
        else onCardDrop(stage.id);
      }}
    >
      <div className="flex items-center gap-2 px-1 py-1">
        {stageDraft.open ? (
          <input
            autoFocus
            value={stageDraft.value}
            onChange={(e) =>
              setStageDraft({ open: true, value: e.target.value })
            }
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") submitStage();
              if (e.key === "Escape") setStageDraft({ open: false, value: "" });
            }}
            onBlur={submitStage}
            className={cn(
              "focus-visible:ring-ring w-40 rounded px-2 py-0.5 text-sm font-medium focus-visible:ring-1 focus-visible:outline-none",
              todoStageColors[stage.color] ?? todoStageColors.gray,
            )}
          />
        ) : (
          <button
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.effectAllowed = "move";
              onStageDragStart();
            }}
            onDragEnd={onStageDragEnd}
            onClick={() => setStageDraft({ open: true, value: stage.name })}
            title="Rename or drag stage"
            className={cn(
              "flex cursor-grab items-center gap-1 rounded px-2 py-0.5 text-sm font-medium active:cursor-grabbing",
              todoStageColors[stage.color] ?? todoStageColors.gray,
            )}
          >
            <GripVertical className="h-3.5 w-3.5" />
            {stage.name}
          </button>
        )}
        <span className="text-muted-foreground text-sm">{cards.length}</span>
        <button
          onClick={() => {
            if (cards.length > 0) {
              toast("Move or delete this stage's todos first");
              return;
            }
            onDeleteStage();
          }}
          className="text-muted-foreground hover:text-destructive ml-auto rounded p-1 transition-colors"
          aria-label="Delete stage"
          title="Delete stage"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {cards.map((card, cardIndex) => (
        <TodoCard
          key={card.id}
          stage={stage}
          card={card}
          index={cardIndex}
          drag={cardDrag}
          onOpen={onOpenTodo}
          onMenu={onTodoMenu}
          onDelete={onDeleteTodo}
          onDragStart={onCardDragStart}
          onDragOver={onCardDragOver}
          onDragEnd={onCardDragEnd}
        />
      ))}

      {cardDrag.id !== null &&
        cardDrag.over?.stageId === stage.id &&
        cardDrag.over.index >= cards.length && (
          <div className="bg-primary h-0.5 rounded" />
        )}

      {todoDraft.open ? (
        <input
          autoFocus
          value={todoDraft.value}
          onChange={(e) => setTodoDraft({ open: true, value: e.target.value })}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") submitTodo();
            if (e.key === "Escape") setTodoDraft({ open: false, value: "" });
          }}
          onBlur={submitTodo}
          placeholder="I need to"
          className="bg-card focus-visible:ring-ring rounded-lg border p-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
        />
      ) : (
        <button
          onClick={() => setTodoDraft({ open: true, value: "" })}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-lg border border-transparent p-3 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> New page
        </button>
      )}
    </div>
  );
}

function TodoCard({
  stage,
  card,
  index,
  drag,
  onOpen,
  onMenu,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  stage: Stage;
  card: Todo;
  index: number;
  drag: CardDrag;
  onOpen: (card: Todo) => void;
  onMenu: (card: Todo, x: number, y: number) => void;
  onDelete: (id: number) => void;
  onDragStart: (id: number) => void;
  onDragOver: (stageId: number, index: number) => void;
  onDragEnd: () => void;
}) {
  return (
    <div>
      {drag.id !== null &&
        drag.over?.stageId === stage.id &&
        drag.over.index === index && (
          <div className="bg-primary mb-2 h-0.5 rounded" />
        )}
      <div
        draggable
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(card);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMenu(card, e.clientX, e.clientY);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(card);
          }
        }}
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.effectAllowed = "move";
          onDragStart(card.id);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          onDragOver(
            stage.id,
            e.clientY < rect.top + rect.height / 2 ? index : index + 1,
          );
        }}
        className={cn(
          "group bg-card hover:border-primary/50 cursor-grab rounded-lg border p-3 text-left shadow-sm transition-colors active:cursor-grabbing",
          drag.id === card.id && "opacity-40",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{card.title}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="text-muted-foreground hover:text-destructive shrink-0 rounded p-0.5 transition-colors"
            aria-label="Delete todo"
            title="Delete todo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

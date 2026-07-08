import { z } from "zod";
import {
  publicProcedure as procedure,
  createTRPCRouter as router,
} from "../trpc";
import { todo, todoStage, todoSettings } from "~/server/db/schema";
/*
  todo router
*/
import { eq, and, asc, desc, isNull, inArray, lt } from "drizzle-orm";
import type { db as Database } from "~/server/db";

export const doneRetention = z.enum(["1d", "1w", "1m", "1y", "never"]);
export type DoneRetention = z.infer<typeof doneRetention>;

const RETENTION_DAYS: Record<Exclude<DoneRetention, "never">, number> = {
  "1d": 1,
  "1w": 7,
  "1m": 30,
  "1y": 365,
};

const STAGE_COLORS = [
  "orange",
  "yellow",
  "rose",
  "green",
  "blue",
  "purple",
  "gray",
];

const DEFAULT_STAGES = [
  { name: "Todo", color: "orange", legacyStatus: "todo" },
  { name: "Started (0-50%)", color: "yellow", legacyStatus: "started" },
  { name: "In Progress (50-99%)", color: "rose", legacyStatus: "in_progress" },
  { name: "Done", color: "green", legacyStatus: "done", isDone: true },
];

async function getStage(db: typeof Database, userId: string, stageId: number) {
  const stage = await db.query.todoStage.findFirst({
    where: and(eq(todoStage.id, stageId), eq(todoStage.owner, userId)),
  });
  if (!stage) {
    throw new Error("Stage not found");
  }
  return stage;
}

export const todoRouter = router({
  getBoard: procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      let stages = await ctx.db.query.todoStage.findMany({
        where: eq(todoStage.owner, userId),
        orderBy: [asc(todoStage.order)],
      });

      // First visit: seed the default stages and attach any todos created
      // before stages existed (they only have a legacy status string).
      if (stages.length === 0) {
        stages = await ctx.db
          .insert(todoStage)
          .values(
            DEFAULT_STAGES.map((stage, index) => ({
              owner: userId,
              name: stage.name,
              color: stage.color,
              order: index,
              isDone: stage.isDone ?? false,
            })),
          )
          .returning();
        for (const [index, stage] of stages.entries()) {
          await ctx.db
            .update(todo)
            .set({
              stageId: stage.id,
              ...(stage.isDone && { completedAt: new Date() }),
            })
            .where(
              and(
                eq(todo.owner, userId),
                isNull(todo.stageId),
                eq(todo.status, DEFAULT_STAGES[index]?.legacyStatus ?? ""),
              ),
            );
        }
      }

      let settings = await ctx.db.query.todoSettings.findFirst({
        where: eq(todoSettings.owner, userId),
      });
      if (!settings) {
        [settings] = await ctx.db
          .insert(todoSettings)
          .values({ owner: userId })
          .returning();
      }
      if (!settings) {
        throw new Error("Failed to load settings");
      }

      // Clean up done todos that outlived the configured retention.
      const retention = doneRetention.parse(settings.doneRetention);
      const doneStageIds = stages.filter((s) => s.isDone).map((s) => s.id);
      if (retention !== "never" && doneStageIds.length > 0) {
        const cutoff = new Date(
          Date.now() - RETENTION_DAYS[retention] * 24 * 60 * 60 * 1000,
        );
        await ctx.db
          .delete(todo)
          .where(
            and(
              eq(todo.owner, userId),
              inArray(todo.stageId, doneStageIds),
              lt(todo.completedAt, cutoff),
            ),
          );
      }

      const todos = await ctx.db.query.todo.findMany({
        where: eq(todo.owner, userId),
        orderBy: [asc(todo.order)],
      });
      return { stages, todos, settings };
    }),
  create: procedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string().min(1).max(500),
        stageId: z.number(),
        tags: z.array(z.string().max(50)).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const stage = await getStage(ctx.db, input.userId, input.stageId);
      const last = await ctx.db.query.todo.findFirst({
        where: and(
          eq(todo.owner, input.userId),
          eq(todo.stageId, input.stageId),
        ),
        orderBy: [desc(todo.order)],
      });
      const [created] = await ctx.db
        .insert(todo)
        .values({
          owner: input.userId,
          title: input.title,
          description: "",
          date: new Date(),
          stageId: input.stageId,
          completedAt: stage.isDone ? new Date() : null,
          tags: input.tags,
          order: (last?.order ?? -1) + 1,
        })
        .returning();
      if (!created) {
        throw new Error("Failed to create todo");
      }
      return created;
    }),
  // Move a todo to a stage and set the full card order of that stage.
  move: procedure
    .input(
      z.object({
        userId: z.string(),
        id: z.number(),
        stageId: z.number(),
        orderedIds: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const stage = await getStage(ctx.db, input.userId, input.stageId);
      const target = await ctx.db.query.todo.findFirst({
        where: and(eq(todo.id, input.id), eq(todo.owner, input.userId)),
      });
      if (!target) {
        throw new Error("Todo not found");
      }
      await ctx.db
        .update(todo)
        .set({
          stageId: input.stageId,
          completedAt: stage.isDone ? (target.completedAt ?? new Date()) : null,
        })
        .where(and(eq(todo.id, input.id), eq(todo.owner, input.userId)));
      for (const [index, id] of input.orderedIds.entries()) {
        await ctx.db
          .update(todo)
          .set({ order: index })
          .where(and(eq(todo.id, id), eq(todo.owner, input.userId)));
      }
      return true;
    }),
  update: procedure
    .input(
      z.object({
        userId: z.string(),
        id: z.number(),
        title: z.string().min(1).max(500).optional(),
        description: z.string().max(5000).optional(),
        date: z.date().optional(),
        tags: z.array(z.string().max(50)).max(10).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(todo)
        .set({
          ...(input.title !== undefined && { title: input.title }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.date !== undefined && { date: input.date }),
          ...(input.tags !== undefined && { tags: input.tags }),
        })
        .where(and(eq(todo.id, input.id), eq(todo.owner, input.userId)));
      return true;
    }),
  delete: procedure
    .input(z.object({ userId: z.string(), id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(todo)
        .where(and(eq(todo.id, input.id), eq(todo.owner, input.userId)));
      return true;
    }),
  createStage: procedure
    .input(z.object({ userId: z.string(), name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const last = await ctx.db.query.todoStage.findFirst({
        where: eq(todoStage.owner, input.userId),
        orderBy: [desc(todoStage.order)],
      });
      const order = (last?.order ?? -1) + 1;
      const [created] = await ctx.db
        .insert(todoStage)
        .values({
          owner: input.userId,
          name: input.name,
          color: STAGE_COLORS[order % STAGE_COLORS.length],
          order,
        })
        .returning();
      if (!created) {
        throw new Error("Failed to create stage");
      }
      return created;
    }),
  renameStage: procedure
    .input(
      z.object({
        userId: z.string(),
        id: z.number(),
        name: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(todoStage)
        .set({ name: input.name })
        .where(
          and(eq(todoStage.id, input.id), eq(todoStage.owner, input.userId)),
        );
      return true;
    }),
  deleteStage: procedure
    .input(z.object({ userId: z.string(), id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await getStage(ctx.db, input.userId, input.id);
      const occupant = await ctx.db.query.todo.findFirst({
        where: and(eq(todo.owner, input.userId), eq(todo.stageId, input.id)),
      });
      if (occupant) {
        throw new Error("Move or delete this stage's todos first");
      }
      await ctx.db
        .delete(todoStage)
        .where(
          and(eq(todoStage.id, input.id), eq(todoStage.owner, input.userId)),
        );
      return true;
    }),
  moveStage: procedure
    .input(z.object({ userId: z.string(), orderedIds: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      for (const [index, id] of input.orderedIds.entries()) {
        await ctx.db
          .update(todoStage)
          .set({ order: index })
          .where(and(eq(todoStage.id, id), eq(todoStage.owner, input.userId)));
      }
      return true;
    }),
  updateSettings: procedure
    .input(z.object({ userId: z.string(), doneRetention }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(todoSettings)
        .set({ doneRetention: input.doneRetention })
        .where(eq(todoSettings.owner, input.userId));
      return true;
    }),
});

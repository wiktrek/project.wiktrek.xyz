import { questionRouter } from "./questions"
import { pollRouter } from "./polls"
import { initTRPC } from '@trpc/server';
const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;
const mergeRouters = t.mergeRouters;
// import { db } from './db';
export const appRouter = mergeRouters(pollRouter, questionRouter);

export type AppRouter = typeof appRouter;
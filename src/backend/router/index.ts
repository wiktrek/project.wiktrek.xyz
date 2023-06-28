import { questionRouter } from "./questions"
import { shortRouter } from "./short"
import { initTRPC } from '@trpc/server';
const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;
const mergeRouters = t.mergeRouters;
// import { db } from './db';
export const appRouter = mergeRouters(shortRouter, questionRouter);

export type AppRouter = typeof appRouter;
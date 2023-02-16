import * as trpc from "@trpc/server";
import { questionRouter } from "./questions";
export const appRouter = trpc.router().merge("questions.", questionRouter);
// export type definition of API
export type AppRouter = typeof appRouter;

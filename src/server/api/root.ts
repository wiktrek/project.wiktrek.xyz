import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { questionRouter } from "./routers/questions";
import { recipeRouter } from "./routers/recipe";
import { shortRouter } from "./routers/short";
import { messageRouter } from "./routers/message";
import { linkRouter } from "./routers/link";
import { todoRouter } from "./routers/todo";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  short: shortRouter,
  question: questionRouter,
  recipe: recipeRouter,
  message: messageRouter,
  link: linkRouter,
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
